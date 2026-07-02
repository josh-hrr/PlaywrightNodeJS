import { test, expect } from '../fixtures/userApiFixtures';
import type { CreateUser } from '../PageObjects/userApiClient';

/**
 * User Management API — /users CRUD
 *
 * CRUD happy path 
 */
test.describe.serial('User Management API — /users CRUD lifecycle', () => {
  const user: CreateUser = {
    name: 'Jane Doe',
    email: `jane.doe.${Date.now()}@example.com`,
    age: 30,
  };

  test('creates a new user (POST /users → 201)', async ({ userApi }) => {
    const response = await userApi.createUser(user);

    expect(response.status()).toBe(201);
    expect(await response.json()).toMatchObject({ ...user });
  });

  test('returns the created user in the list (GET /users → 200)', async ({
    userApi,
  }) => {
    const response = await userApi.listAllUsers();

    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users).toContainEqual(expect.objectContaining({ email: user.email }));
  });

  test('retrieves the user by email (GET /users/{email} → 200)', async ({
    userApi,
  }) => {
    const response = await userApi.getUser(user.email);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ ...user });
  });

  test('updates the user (PUT /users/{email} → 200)', async ({ userApi }) => {
    const updated = { ...user, name: 'Jane Updated', age: 31 };

    const response = await userApi.updateUser(updated, user.email);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(updated);
  });

  test('deletes the user with a valid token (DELETE /users/{email} → 204)', async ({
    userApi,
  }) => {
    const response = await userApi.deleteUser(user.email);

    expect(response.status()).toBe(204);
  });

  test('no longer finds the deleted user (GET /users/{email} → 404)', async ({
    userApi,
  }) => {
    await expect(userApi.getUser(user.email)).rejects.toThrow(/404/);
  });
});

/**
 * Negative test cases:
 * 1. Error 404 for missing resources.
 * 2. Error 401 when the delete token is absent.
 */
test.describe('User Management API — error handling', () => {
  test('returns 404 for a user that does not exist (GET /users/{email})', async ({
    userApi,
  }) => {
    await expect(
      userApi.getUser('does-not-exist@example.com'),
    ).rejects.toThrow(/404/);
  });

  test('rejects a delete without an auth token (DELETE /users/{email} → 401)', async ({
    userApi,
    unauthenticatedUserApi,
  }) => {
    // Arrange: create a real user with the authenticated client so the request
    // fails on authentication rather than because the user is missing.
    const target: CreateUser = {
      name: 'Auth Guard',
      email: `auth.guard.${Date.now()}@example.com`,
      age: 40,
    };
    await userApi.createUser(target);

    // Act + Assert: deleting without the Authentication header must be rejected.
    await expect(
      unauthenticatedUserApi.deleteUser(target.email),
    ).rejects.toThrow(/401/);

    // Cleanup: remove the user with the authenticated client.
    await userApi.deleteUser(target.email);
  });
});
