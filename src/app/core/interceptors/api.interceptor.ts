import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Don't add the Authorization header for the login or refresh token endpoint
  if (req.url.endsWith('/token')) {
    return next(req);
  }

  // Clone the request to add the authentication header.
  const authReq = req.clone({
    setHeaders: {
      Authorization: `${authService.getTokenType()} ${authService.getToken()}` || 'Token Not Found' // Use Bearer token format
    }
  });

  return next(authReq).pipe(
    catchError(async (error: HttpErrorResponse) => {
      // Check if the error is a 401 Unauthorized
      if (error.status === 401) {
        try {
          // Call the refresh token API with async/await
          const response = await authService.refreshToken();

          if (response) {
            // Update the local storage with the new token
            authService.setAuthTokens(response.data);
            
            // Clone the original request with the new token
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `${authService.getTokenType()} ${authService.getToken()}` || 'Token Not Found', // Use Bearer token format
              },
            });
            
            // Retry the original request with the new token
            return lastValueFrom(next(newAuthReq)); // Convert observable to promise
          } else {
            // If the refresh token API returns no response, log the user out
            authService.logout();
            router.navigateByUrl('/auth/login');
            throw new Error('Refresh token failed: No response');
          }
        } catch (refreshError: any) {
          console.log(refreshError, 'refreshError');
  
          // If the refresh token API also fails with 401, log the user out
          if (refreshError.status === 401) {
            authService.logout();
            router.navigateByUrl('/auth/login');
          }
  
          // Rethrow the refresh error to stop further retries
          throw refreshError;
        }
      }
  
      // If the error is not a 401, just throw the error as it is
      throw error;
    })
);
  
};