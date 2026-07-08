
const getBaseUrl = (): string => {
  // Allow override via environment variable for different deployments
  if (typeof window !== 'undefined' && window.__ENV__?.API_BASE_URL) {
    return window.__ENV__.API_BASE_URL;
  }
  return 'http://localhost:8080/api/pablococina';
};

const getDemoMode = (): boolean => {
  // Demo mode enabled by default; disable by setting localStorage flag or env var
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('pablo_cocina_demo_mode');
    if (stored !== null) return stored === 'true';
    if (window.__ENV__?.DEMO_MODE !== undefined) return window.__ENV__.DEMO_MODE === 'true';
  }
  return true;
};

export const API_CONFIG = {
  baseUrl: getBaseUrl(),
  isDemoMode: getDemoMode(),
};
