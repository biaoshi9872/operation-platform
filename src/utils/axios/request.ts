import type { InternalRequestConfig } from '#/axios'
import store, { useUserStore } from '@/stores'
import { getLocal } from '@/utils/storage'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import qs from 'qs'
const CancelToken = axios.CancelToken
const cancelMap = new Map() // cancelMap
/**
 * 401 无权限
 */
const VALID_STATUS = [401, 1002, 470]
const SUCCESS_STATUS = [0, 200, 470, 4701]
export const getService = (config: AxiosConfig = { timeout: 45000, baseURL: import.meta.env.VITE_BASE_API }): AxiosInstance => {
  // 创建axios实例
  const service = axios.create({
    baseURL: config.baseURL, // api的base_url
    withCredentials: true,
    timeout: config.timeout, // 请求超时时间
    validateStatus(status) {
      return (status >= 200 && status < 300) || VALID_STATUS.includes(status)
    }
  })
  // request拦截器
  service.interceptors.request.use(
    (config: InternalRequestConfig) => {
      config.headers.token = getLocal(import.meta.env.VITE_TOKEN_KEY)
      const configData = config.data
      const configParams = config.params

      if (typeof configData !== 'object' && typeof configParams !== 'object') {
        return config
      }
      const { cancelKey, encode, formData } = config.requestOptions || {}
      if (encode) config.data = qs.stringify(configData)
      if (formData) {
        const data = new FormData()
        Object.keys(configData).forEach(key => {
          const curValue = configData[key]
          data.set(key, configData[key])
        })
        config.data = data
      }
      // 如果接口需要 cancel 则向 cancelMap 中保存当前请求
      if (cancelKey) {
        config.cancelToken = new CancelToken(c => {
          cancelMap.set(config, c)
        })
      }

      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
  // response拦截器
  service.interceptors.response.use(
    response => {
      // 请求已完成 删除 cancel
      cancelMap.delete(response.config)
      const { noCheck, noMessage, generationFile, noData } = (response.config as InternalRequestConfig).requestOptions || {}
      if (response.data.code == 1002 || response.data.code == 1001 || response.data.code == 401) {
        ElMessage.error({ message: '没有访问权限或token过期！', duration: 2000 })
        const userStore = useUserStore(store)
        userStore.clearInfo()
        location.reload()
        return Promise.reject(new Error(response.data.msg || '没有访问权限'))
      }
      if (VALID_STATUS.includes(response.data.code)) {
        return Promise.reject(new Error(response.data.msg || '没有访问权限'))
      }
      if (noCheck) return response.data
      if (generationFile)
        return {
          fileName: response.headers['filename'],
          data: response.data
        }
      const res = response.data
      if (!SUCCESS_STATUS.includes(res.code)) {
        if (!noMessage) {
          // res.msg
          ElMessage.error(res.msg || '网络请求错误')
        }
        return Promise.reject(response)
      } else {
        if (noData) return res
        else return res.hasOwnProperty('data') ? res.data : res
      }
    },
    error => {
      ElMessage.error({ message: error?.response?.statusText || '' + [error?.response?.status] || '' || '网络异常或请求超时', duration: 2000 })
      console.log(error, error.response, 'response')
      return Promise.reject(new Error((error.response ? `${error.response.config.url} ` : '') + error))
    }
  )
  return service
}
/**
 * 通过请求 配置的 cancelKey 取消对应的请求（可以是多个）
 * @param {String} cancelKey 取消请求的 key 来自 request config 配置中的 cancelKey
 * @returns {Promise} 返回一个 resolve 状态的 promise
 */
export function requestCancel(cancelKey: string) {
  return new Promise(resolve => {
    cancelMap.forEach((cancel, config) => {
      config.cancelKey === cancelKey && cancel()
    })
    // 保证原始请求的 then 等后续微任务走完
    setTimeout(() => {
      resolve(undefined)
    }, 0)
  })
}

const service = getService()

export default service
