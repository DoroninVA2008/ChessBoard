import type { AxiosRequestConfig } from 'axios'
import { api } from './api/api'

export async function AxiosAPIXML<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.get<T>(url, config)
  return response.data
}