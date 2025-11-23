import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig<TBody = unknown> {
  method?: HttpMethod;
  url: string;
  body?: TBody;
  headers?: Record<string, string>;
  schema?: z.ZodTypeAny;
  requiresAuth?: boolean;
  signal?: AbortSignal;
}

export interface HttpError extends Error {
  status: number;
  data?: unknown;
}

const requestInterceptors: Array<(config: RequestInit) => RequestInit> = [];
const responseInterceptors: Array<(response: Response) => Promise<Response>> = [];

export const addRequestInterceptor = (fn: (config: RequestInit) => RequestInit) => {
  requestInterceptors.push(fn);
};

export const addResponseInterceptor = (fn: (response: Response) => Promise<Response>) => {
  responseInterceptors.push(fn);
};

const applyRequestInterceptors = (config: RequestInit) =>
  requestInterceptors.reduce((acc, interceptor) => interceptor(acc), config);

const applyResponseInterceptors = async (response: Response) => {
  let current = response;
  for (const interceptor of responseInterceptors) {
    current = await interceptor(current);
  }
  return current;
};

export async function http<TResponse = unknown, TBody = unknown>(config: RequestConfig<TBody>): Promise<TResponse> {
  const { method = 'GET', url, body, headers, schema, requiresAuth = true, signal } = config;
  const token = localStorage.getItem('access_token');

  const init: RequestInit = {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(requiresAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    signal,
  };

  const interceptedInit = applyRequestInterceptors(init);
  const response = await fetch(`${API_BASE_URL}${url}`, interceptedInit);
  const finalResponse = await applyResponseInterceptors(response);

  const isJson = finalResponse.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await finalResponse.json() : await finalResponse.text();

  if (!finalResponse.ok) {
    const error = new Error('API request failed') as HttpError;
    error.status = finalResponse.status;
    error.data = data;
    throw error;
  }

  if (schema) return schema.parse(data) as TResponse;
  return data as TResponse;
}