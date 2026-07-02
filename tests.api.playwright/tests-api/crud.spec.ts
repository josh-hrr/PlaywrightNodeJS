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

  test('no longer lists the deleted user (GET /users → 200)', async ({
    userApi,
  }) => { 
    const response = await userApi.listAllUsers();

    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(users).not.toContainEqual(
      expect.objectContaining({ email: user.email }),
    );
  });
});
