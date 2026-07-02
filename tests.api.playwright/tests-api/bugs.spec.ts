import { test, expect } from '../fixtures/userApiFixtures';
import type { CreateUser } from '../PageObjects/userApiClient';

/**
 * Bug-exposing tests — spec violations in the User Management API.
 *
 * Every test here asserts the behaviour documented in sdet_challenge_api.yml.
 * They FAIL against the current application because it deviates from the spec.
 * The failures are intentional: the red result IS the evidence for each bug,
 * and every case is written up in BUGS.md.
 *
 * The GitHub Actions dev/prod stages run in parallel, so these expected
 * failures never block either environment.
 */
test.describe('Known API bugs — spec violations', () => {
  /**
   * BUG-001 — GET /users/{email} for a user that does not exist.
   * Spec: 404 { "error": "User not found" }.
   * Actual: 500 { "error": "Internal server error" }.
   */
  test('BUG-001: GET /users/{email} for a missing user should return 404, not 500', async ({
    userApi,
  }) => {
    await expect(
      userApi.getUser('does-not-exist@example.com'),
    ).rejects.toThrow(/404/);
  });

  /**
   * BUG-002 — DELETE /users/{email} without the required Authentication header.
   * Spec: 401 (authentication required or invalid).
   * Actual: 204 — the auth token is not enforced and the user is deleted. 
   */
  test('BUG-002: DELETE /users/{email} without an auth token should return 401, not 204', async ({
    userApi,
    unauthenticatedUserApi,
  }) => {
    // Arrange: create a real user  
    const target: CreateUser = {
      name: 'Auth Guard',
      email: `auth.guard.${Date.now()}@example.com`,
      age: 40,
    };
    await userApi.createUser(target);

    try {
      // Spec: a delete with no Authentication header must be rejected with 401.
      await expect(
        unauthenticatedUserApi.deleteUser(target.email),
      ).rejects.toThrow(/401/);
    } finally { 
      await userApi.deleteUser(target.email).catch(() => {});
    }
  });
 
});
