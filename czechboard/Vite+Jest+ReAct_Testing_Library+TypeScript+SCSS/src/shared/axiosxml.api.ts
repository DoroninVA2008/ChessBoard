import type { AxiosRequestConfig } from 'axios'
import { api } from './api/api'

export async function AxiosAPIGETXML<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.get<T>(url, config) // || await api.post<T>(url, config) || await api.put<T>(url, config) || await api.patch<T>(url, config) || await api.delete<T>(url, config) || await api.head<T>(url, config) || await api.options<T>(url, config) || await api.connect<T>(url, config) || await api.trace<T>(url, config)
  return response.data
}

export async function AxiosAPIPOSTXML<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.post<T>(url, config)
  return response.data
}