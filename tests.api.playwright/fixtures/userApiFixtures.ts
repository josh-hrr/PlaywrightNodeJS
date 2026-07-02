import { APIRequestContext, test as base } from '@playwright/test';
import { UserApiClient } from '../PageObjects/userApiClient'

// UserApiOptions to handle dev/prod environments
export type UserApiOptions = {
  apiBaseURL: string | undefined;
  apiAuthToken: string | undefined;
};

// Extend the base fixtures type
type UserApiFixtures = {
  apiContext: APIRequestContext;
  userApi: UserApiClient;
  // used to assert the DELETE 401 path.
  unauthenticatedUserApi: UserApiClient;
};
 
export const test = base.extend<UserApiOptions & UserApiFixtures>({
  // Options — overridable per project in playwright.config.ts.
  apiBaseURL: [process.env.TEST_BASE_URL, { option: true }],
  apiAuthToken: [process.env.TEST_AUTH_TOKEN, { option: true }],

  // Base API context fixture
  apiContext: async ({ playwright, apiBaseURL }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: apiBaseURL,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    await use(apiContext);
    await apiContext.dispose();
  },
  // User Management API client fixture
  userApi: async ({ apiContext, apiBaseURL, apiAuthToken }, use) => {
    const userApi = new UserApiClient(apiContext, apiBaseURL, apiAuthToken);
    await use(userApi);
  },
  // Client with no auth token configured (Authentication header omitted).
  unauthenticatedUserApi: async ({ apiContext, apiBaseURL }, use) => {
    const userApi = new UserApiClient(apiContext, apiBaseURL);
    await use(userApi);
  },
});

export { expect } from '@playwright/test';
