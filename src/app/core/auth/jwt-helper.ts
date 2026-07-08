import { DecodedToken } from '../models/types';

/**
 * Safely parses JSON from localStorage, returning fallback on corrupt data.
 */
export function safeParseJSON<T>(json: string | null, fallback: T): T {
  if (json === null) return fallback;
  try { return JSON.parse(json) as T; }
  catch { return fallback; }
}

/**
 * Safely stringifies a value for localStorage.
 */
export function safeStringify(value: unknown): string {
  try { return JSON.stringify(value); }
  catch { return ''; }
}

/**
 * Decodes the payload of a JWT token without verifying the signature.
 *
 * @param token Raw JWT string
 * @param onError Optional callback invoked when parsing fails
 * @returns Decoded payload or null
 */
export function decodeToken(token: string, onError?: (err: unknown) => void): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    if (onError) onError(e);
    return null;
  }
}
