import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withComponentInputBinding, withViewTransitions  } from '@angular/router';
import  Noir from '@/app/theme/app-theme';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from '@/app/core/interceptors/api.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService, 
    ConfirmationService,
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes,withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), 
            withEnabledBlockingInitialNavigation(),
            withComponentInputBinding(),
            withViewTransitions()),
    provideAnimationsAsync(),
    providePrimeNG({ theme: Noir, ripple: false, inputStyle: 'outlined' }),
    provideHttpClient(withInterceptors([apiInterceptor])),
    
  ]
};
