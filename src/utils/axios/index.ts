import request from './request'
import type { RequestConfig } from '#/axios'

export interface PaginationResponse<T> {
  page: number
  totalSize: number
  data: T[]
}

export default async <T>(config: RequestConfig): Promise<T> => {
  return request(config)
}

/**
 * POST
 * @param config
 * @returns
 */
export const postRequest = <T>(config: RequestConfig): Promise<T> => {
  const postConfig: RequestConfig = {
    ...config,
    method: 'post'
  }
  return request(postConfig)
}

/**
 * post from格式
 * @param config
 * @returns
 */
export const postFromRequest = <T>(config: RequestConfig): Promise<T> => {
  const postConfig: RequestConfig = {
    ...config,
    method: 'post',
    requestOptions: {
      ...config.requestOptions,
      formData: true
    }
  }
  return request(postConfig)
}

/**
 * get
 */
export const getRequest = <T>(config: RequestConfig): Promise<T> => {
  const postConfig: RequestConfig = {
    ...config,
    method: 'get'
  }
  return request(postConfig)
}

/**
 * get fromData格式
 * @param config
 * @returns
 */
export const getFromFromRequest = <T>(config: RequestConfig): Promise<T> => {
  const postConfig: RequestConfig = {
    ...config,
    method: 'get',
    requestOptions: {
      ...config.requestOptions,
      formData: true
    }
  }
  return request(postConfig)
}

/**
 * 流返回
 * @param config
 * @returns
 */
export const blobRequest = <T>(config: RequestConfig): Promise<T> => {
  const postConfig: RequestConfig = {
    ...config,
    responseType: 'blob',
    requestOptions: {
      ...config.requestOptions,
      noCheck: true
    }
  }
  return request(postConfig)
}
