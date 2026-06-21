type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  ok: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function request<T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<ApiResponse<T>> {
  try {
    const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(url, options);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { data: null, error: `HTTP ${res.status}: ${text || res.statusText}`, ok: false };
    }
    const data = await res.json() as T;
    return { data, error: null, ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error de red';
    return { data: null, error: message, ok: false };
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, 'GET'),
  post: <T>(endpoint: string, body: unknown) => request<T>(endpoint, 'POST', body),
  put: <T>(endpoint: string, body: unknown) => request<T>(endpoint, 'PUT', body),
  delete: <T>(endpoint: string) => request<T>(endpoint, 'DELETE'),
};
