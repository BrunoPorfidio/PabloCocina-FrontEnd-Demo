

import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { AppComponent } from './src/app/app.component';
import { authInterceptor } from './src/app/core/auth/auth.interceptor';
import { loadingInterceptor } from './src/app/core/interceptors/loading.interceptor';
import { demoInterceptor } from './src/app/core/demo/demo.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(
      withFetch(),
      // Order matters: demo interceptor runs first to catch API calls,
      // then auth interceptor adds headers, then loading interceptor
      withInterceptors([demoInterceptor, authInterceptor, loadingInterceptor])
    )
  ]
}).catch((err) => console.error(err));
