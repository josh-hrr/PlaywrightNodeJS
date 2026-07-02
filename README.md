# User Management API — E2E Test Suite

End-to-end API test suite for the User Management API, built with
[Playwright](https://playwright.dev/) (TypeScript). The suite exercises every
endpoint documented in `sdet_challenge_api.yml` across both the **dev** and
**prod** environments, runs in GitHub Actions, and documents the spec
discrepancies found along the way.

## Deliverables

| Deliverable | Description | Where to find it |
|---|---|---|
| **E2E Test Suite** | Source code for the end-to-end test suite | — Folder: [tests.api.playwright/](tests.api.playwright/) — specs: [tests-api/](tests.api.playwright/tests-api/) — API client (POM): [PageObjects/userApiClient.ts](tests.api.playwright/PageObjects/userApiClient.ts) Fixtures: [fixtures/userApiFixtures.ts](tests.api.playwright/fixtures/userApiFixtures.ts) |
| **GitHub Actions Pipeline** | A working `.github/workflows/` configuration | [.github/workflows/pipeline_challenge.yml](.github/workflows/pipeline_challenge.yml) — parallel `api-dev` and `api-prod` jobs |
| **Bugs Report** | File documenting the bugs discovered | [BUGS.md](BUGS.md) |
| **Testing Report** | Reports produced by the test tool | Playwright HTML report in `playwright-report/` (run `npx playwright show-report`); uploaded per environment as CI artifacts in GitHub Actions `playwright-report-dev` / `playwright-report-prod` |

## Project layout

```
tests.api.playwright/
├─ tests-api/
│  ├─ crud.spec.ts        # Functional CRUD lifecycle 
│  └─ bugs.spec.ts        # Spec-violation tests (see BUGS.md)
├─ PageObjects/
│  └─ userApiClient.ts    # API client / Page Object Model for /users
├─ fixtures/
│  └─ userApiFixtures.ts  # Playwright fixtures + per-project env options
└─ TestData/              # CSV test data
.github/workflows/
└─ pipeline_challenge.yml # CI: parallel dev + prod stages
BUGS.md                   # Discovered spec discrepancies
playwright.config.ts      # api-dev / api-prod projects, dotenv wiring
```

## Prerequisites

- Node.js 20+
- Docker - to run the application under test

## Setup

```bash
npm ci
```

Environment variables are read from `.env` (loaded via `dotenv` in
`playwright.config.ts`):

```
TEST_BASE_URL=http://localhost:3000/dev
TEST_AUTH_TOKEN=mysecrettoken
PROD_BASE_URL=http://localhost:3000/prod
PROD_AUTH_TOKEN=mysecrettoken
```

## Run the application under test

```bash
docker run -d -p 3000:3000 ghcr.io/danielsilva-loanpro/sdet-interview-challenge:latest
```

## Run the tests

```bash
# Against the dev environment
npx playwright test --project=api-dev

# Against the prod environment
npx playwright test --project=api-prod

# Readable console output
npx playwright test --project=api-dev --reporter=list

# Only the bug-exposing suite
npx playwright test tests.api.playwright/tests-api/bugs.spec.ts --project=api-dev
```

Open the HTML report:

```bash
npx playwright show-report
```

## Notes on test results

- **[crud.spec.ts](tests.api.playwright/tests-api/crud.spec.ts)** covers the full
  CRUD lifecycle and is expected to **pass**.
- **[bugs.spec.ts](tests.api.playwright/tests-api/bugs.spec.ts)** asserts the
  documented spec behaviour and is expected to **fail** — those failures are the
  evidence for the discrepancies described in [BUGS.md](BUGS.md). The CI dev and
  prod stages run in parallel so these expected failures never block either
  environment.
stall
