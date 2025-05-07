import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

export interface RequestOptions {
  encode?: boolean
  formData?: boolean
  cancelKey?: string
  noCheck?: boolean
  noData?: boolean
  generationFile?: boolean,
  noMessage?: boolean
}

export interface RequestConfig extends AxiosRequestConfig {
  requestOptions?: RequestOptions
}

export interface InternalRequestConfig extends InternalAxiosRequestConfig {
  requestOptions?: RequestOptions
}
