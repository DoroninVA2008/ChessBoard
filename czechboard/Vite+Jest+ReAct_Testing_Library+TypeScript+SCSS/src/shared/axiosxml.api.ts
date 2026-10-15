import type { AxiosRequestConfig } from 'axios'
import { api } from './api/api'

export async function request<TResponse, TBody = unknown>(options: {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  body?: TBody
  config?: AxiosRequestConfig
}): Promise<TResponse> {
  const { method = 'GET', url, body, config } = options

  const response = await api.request<TResponse>({
    ...config,
    method,
    url,
    data: body,
  })

  return response.data
}

export function AxiosAPIGETXML<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({ method: 'GET', url, config })
}

export function AxiosAPIPOSTXML<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T, B>({ method: 'POST', url, body, config })
}

export function AxiosAPIPUTXML<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T, B>({ method: 'PUT', url, body, config })
}

export function AxiosAPIPATCHXML<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T, B>({ method: 'PATCH', url, body, config })
}

export function AxiosAPIDELETEXML<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({ method: 'DELETE', url, config })
}