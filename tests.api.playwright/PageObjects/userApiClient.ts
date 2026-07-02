import { APIRequestContext, APIResponse } from '@playwright/test';
/**
 * User Management API Page Object Model
 * Encapsulates all DM API endpoints and operations
 */
export class UserApiClient {
  constructor(
    private apiContext: APIRequestContext,
    private baseURL: string | undefined,
    private authToken?: string,
  ) {}

  /**
   * Generic method to handle API responses with error handling
   */
  private async handleResponse(response: APIResponse) {
    if (response.status() >= 400) {
      const rawBody = await response.text();
      let parsedBody: unknown = rawBody;

      if (rawBody) {
        try {
          parsedBody = JSON.parse(rawBody);
        } catch {
          // Keep raw text when the body is not valid JSON.
          parsedBody = rawBody;
        }
      } 
      throw new Error(
        `API Error: ${response.status()} ${response.statusText()}\n${JSON.stringify(parsedBody, null, 2)}`,
      );
    }
    return response;
  }

  /**
   * listAllUsers
   */
  async listAllUsers(): Promise<APIResponse> {
    const response = await this.apiContext.get(`${this.baseURL}/users`);
    return this.handleResponse(response);
  }
  /**
   * createUser
   */
  async createUser(payload: CreateUser): Promise<APIResponse> {
    const response = await this.apiContext.post(`${this.baseURL}/users`, {
      data: payload,
    });
    return this.handleResponse(response);
  }
  /**
   * getUser — fetch a single user by email (primary key)
   */
  async getUser(email: string): Promise<APIResponse> {
    const response = await this.apiContext.get(
      `${this.baseURL}/users/${email}`,
    );
    return this.handleResponse(response);
  }
  /**
   * updateUser
   */
  async updateUser(payload: UpdateUser, email: string): Promise<APIResponse> {
    const response = await this.apiContext.put(
      `${this.baseURL}/users/${email}`,
      {
        data: payload,
      },
    );
    return this.handleResponse(response);
  }
  // deleteUser  
  async deleteUser(email: string): Promise<APIResponse> {
    const response = await this.apiContext.delete(
      `${this.baseURL}/users/${email}`,
      {
        headers: this.authToken
          ? { Authentication: this.authToken }
          : undefined,
      },
    );
    return this.handleResponse(response);
  }
}

// Type definitions based on the API schema
export interface CreateUser {
  name: string,
  email: string,
  age: number 
} 
export interface UpdateUser {
  name: string;
  email: string;
  age: number;
}  