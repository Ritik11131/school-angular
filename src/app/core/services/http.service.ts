import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = environment.apiUrl;
  private authUrl = environment.authUrl;

  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        // Add other headers if needed
      })
    };
  }

  private getBaseUrl(isAuth: boolean): string {
    return isAuth ? this.authUrl : this.apiUrl;
  }

  /**
   * Send a POST request to the given endpoint with the given data.
   *
   * @param endpoint The endpoint to send the request to.
   * @param data The data to send in the request body.
   * @param isAuth Optional flag to indicate if the request is for authentication.
   * @returns A promise that resolves to the response.
   */
  post<T>(endpoint: string, data: any, isAuth: boolean = false): Promise<T> {
    return firstValueFrom(this.http.post<T>(`${this.getBaseUrl(isAuth)}/${endpoint}`, data, this.getHttpOptions()));
  }

  /**
   * Send a PUT request to the given endpoint with the given data.
   *
   * @param endpoint The endpoint to send the request to.
   * @param id The ID of the resource to update.
   * @param data The data to send in the request body.
   * @param isAuth Optional flag to indicate if the request is for authentication.
   * @returns A promise that resolves to the response.
   */
  put<T>(endpoint: string, id: number | undefined, data: any, isAuth: boolean = false): Promise<T> {
    return firstValueFrom(this.http.put<T>(`${this.getBaseUrl(isAuth)}/${endpoint}/${id}`, data, this.getHttpOptions()));
  }

  /**
   * Send a GET request to the given endpoint with the given query parameters.
   *
   * @param endpoint The endpoint to send the request to.
   * @param query The query parameters to send in the request.
   * @param id Optional ID to append to the endpoint.
   * @param isAuth Optional flag to indicate if the request is for authentication.
   * @returns A promise that resolves to the response.
   */
  get<T>(endpoint: string, query?: any, id?: any, isAuth: boolean = false): Promise<T> {
    let params = new HttpParams();
    if (query) {
      Object.keys(query).forEach(key => {
        params = params.append(key, query[key]);
      });
    }
    const url = `${this.getBaseUrl(isAuth)}/${endpoint}${id ? '/' + id : ''}`;
    return firstValueFrom(this.http.get<T>(url, { ...this.getHttpOptions(), params }));
  }

  /**
   * Send a DELETE request to the given endpoint.
   *
   * @param endpoint The endpoint to send the request to.
   * @param id The ID of the resource to delete.
   * @param isAuth Optional flag to indicate if the request is for authentication.
   * @returns A promise that resolves to the response.
   */
  delete<T>(endpoint: string, id: number | undefined, isAuth: boolean = false): Promise<T> {
    return firstValueFrom(this.http.delete<T>(`${this.getBaseUrl(isAuth)}/${endpoint}/${id}`, this.getHttpOptions()));
  }
}