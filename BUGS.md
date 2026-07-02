# Bug Report — User Management API

Discrepancies between the application's behaviour and the authoritative
specification (`sdet_challenge_api.yml`), discovered while developing the
end-to-end test suite.

- **Application under test:** `ghcr.io/danielsilva-loanpro/sdet-interview-challenge:latest`
- **Environments:** `dev` (`/dev`) and `prod` (`/prod`)
- **Exposing tests:** [tests.api.playwright/tests-api/bugs.spec.ts](tests.api.playwright/tests-api/bugs.spec.ts)

Each bug has a dedicated, intentionally **failing** test. The red result is the
evidence; the test turns green only once the application matches the spec.

---

## BUG-001 — `GET /users/{email}` returns 500 instead of 404 for a missing user

| | |
|---|---|
| **Endpoint** | `GET /{env}/users/{email}` |
| **Severity** | Medium |
| **Spec** | `404 Not Found` with body `{ "error": "User not found" }` |
| **Actual** | `500 Internal Server Error` with body `{ "error": "Internal server error" }` |
| **Test** | `BUG-001: GET /users/{email} for a missing user should return 404, not 500` |

### Steps to reproduce
1. `GET http://localhost:3000/dev/users/does-not-exist@example.com`

### Expected
```
HTTP 404
{ "error": "User not found" }
```

### Actual
```
HTTP 500
{ "error": "Internal server error" }
```

### Notes
- `GET /users/{email}` for an **existing** user works correctly (`200`), so the
  fault is isolated to the *not-found* code path — the handler appears to
  dereference a missing record instead of returning a controlled `404`. 

---

## BUG-002 — `DELETE /users/{email}` is not authenticated (returns 204 without a token)

| | |
|---|---|
| **Endpoint** | `DELETE /{env}/users/{email}` |
| **Severity** | **High — authorization bypass** |
| **Spec** | `Authentication` header is **required**; missing/invalid → `401 Unauthorized` |
| **Actual** | Request with **no** `Authentication` header returns `204 No Content` and deletes the user |
| **Test** | `BUG-002: DELETE /users/{email} without an auth token should return 401, not 204` |

### Steps to reproduce
1. Create a user: `POST http://localhost:3000/dev/users` with a valid body.
2. `DELETE http://localhost:3000/dev/users/{email}` **with no `Authentication` header**.

### Expected
```
HTTP 401
{ "error": "..." }        # authentication required or invalid
```

### Actual
```
HTTP Status code: 204                  
```

### Notes
- The auth token is **not enforced at all** on delete. Because of this, the
  "delete with a valid token → 204" case passes for the *wrong* reason, so it cannot be treated as evidence the auth works.
- This is the highest-impact issue.

--- 

## How to reproduce the full report

```bash
# App must be running locally first:
docker run -d -p 3000:3000 ghcr.io/danielsilva-loanpro/sdet-interview-challenge:latest

# Run against dev and/or prod:
npx playwright test tests.api.playwright/tests-api/bugs.spec.ts --project=api-dev  --reporter=list
npx playwright test tests.api.playwright/tests-api/bugs.spec.ts --project=api-prod --reporter=list
```
