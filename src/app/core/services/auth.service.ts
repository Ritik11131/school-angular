import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Adjust the path as necessary
import { environment } from '@/environments/environment';
import { LOGIN_ENDPOINT, REFRESH_ENDPOINT } from '@/app/shared/constants/endpoint'; // Adjust the path as necessary
import { IResponse } from '@/app/shared/interfaces/api.interfaces';
import { ILogin } from '@/app/shared/interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor(private httpService: HttpService) {}

  /**
   * Log in the user and store the token.
   * @param loginId The id of the user.
   * @param password The password of the user.
   * @returns A promise that resolves to the authentication response.
   */
  async login(username: string, password: string): Promise<IResponse> {
    const data = {
        audience: 'web',
        grantType: "PASSWORD",
        clientId: environment.CLIENT_ID,
        clientSecret: environment.CLIENT_SECRET,
        username,
        password,
      };
    const response: IResponse  = await this.httpService.post<IResponse>(LOGIN_ENDPOINT, data, true);
    this.setAuthTokens(response.data); // Assuming the response contains a token
    return response;
  }

  /**
   * Log out the user and clear the token.
   */
  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token'); // Clear token from local storage
    localStorage.removeItem('refresh_token'); // Clear token from local storage
    localStorage.removeItem('type'); // Clear token from local storage
    localStorage.removeItem('lastSelectedNav'); // Clear last nav from local storage
  }

  /**
   * Check if the user is authenticated.
   * @returns True if the user is authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Set the token in local storage.
   * @param token The token to set.
   */
  public setAuthTokens(loginResponse: ILogin): void {
    this.token = loginResponse.accessToken;
    localStorage.setItem('access_token', loginResponse.accessToken);
    localStorage.setItem('refresh_token', loginResponse.refreshToken);
    localStorage.setItem('type', loginResponse.type);
  }

  /**
   * Get the token from local storage.
   * @returns The token if it exists, null otherwise.
   */
  public getToken(): string | null {
    return this.token || localStorage.getItem('access_token');
  }

  /**
   * Get the token from local storage.
   * @returns The token if it exists, null otherwise.
   */
  public getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Get the token from local storage.
   * @returns The token if it exists, null otherwise.
   */
  public getTokenType(): string | null {
    return localStorage.getItem('type');
  }

  async refreshToken(): Promise<IResponse> {
    const response = await this.httpService.post<IResponse>(REFRESH_ENDPOINT, { refreshToken : this.getRefreshToken() }, true);
    return response;
  }
}