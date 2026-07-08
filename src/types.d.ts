/**
 * Global environment variable injection via window.__ENV__
 * Used to configure API_BASE_URL and DEMO_MODE at deployment time
 * without rebuilding the application.
 */
interface WindowEnv {
  API_BASE_URL?: string;
  DEMO_MODE?: string;
}

interface Window {
  __ENV__?: WindowEnv;
}

// sockjs-client no tiene tipos oficiales
declare module 'sockjs-client';
