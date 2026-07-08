
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // CRITICAL FIX: Ignorar peticiones a Cloudinary.
  if (req.url.includes('cloudinary.com')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token && typeof token === 'string' && token.trim().length > 0) {
    // Don't add Bearer header for demo JWT tokens (they're not real JWTs)
    if (token.startsWith('demo-jwt-')) {
      // Demo mode: attach a mock Bearer for compat but skip real JWT validation
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(cloned);
    }
    
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
