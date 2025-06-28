import { getToken } from '@/utils/auth'
import errorCodeRaw from '@/utils/errorCode'
import { toast, showConfirm } from '@/utils/uni-utils'
import { tansParams } from '@/utils/utils'
import type { RequestConfig } from '@/types/http'
import { useUserStore } from '@/store/modules/user'

let timeout = 10000
const baseUrl = import.meta.env.VITE_APP_BASE_URL

// 明确类型
const errorCode: Record<string, string> = errorCodeRaw as Record<string, string>

const request = (config: RequestConfig): Promise<any> => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  config.header = config.header || {}
  if (getToken() && !isToken) {
    config.header['Authorization'] = 'Bearer ' + getToken()
  }
  // get请求映射params参数
  if (config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.url = url
  }
  return new Promise((resolve, reject) => {
    uni.request({
        method: (config.method || 'get').toUpperCase() as
          | 'OPTIONS'
          | 'GET'
          | 'HEAD'
          | 'POST'
          | 'PUT'
          | 'DELETE'
          | 'TRACE'
          | 'CONNECT',
        timeout: config.timeout || timeout,
        url: config.baseUrl || baseUrl + config.url,
        data: config.data,
        header: config.header,
        dataType: 'json'
      }).then((response: any) => {
        const code = response.data.code || 200
        const msg = errorCode[String(code)] || response.data.msg || errorCode['default']
        if (code === 401) {
          showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then((confirmed: boolean) => {
            if (confirmed) {
              const userStore = useUserStore()
              userStore.logout().then(() => {
                uni.reLaunch({ url: '/pages/login/index' })
              })
            }
          })
          reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code === 500) {
          toast(msg)
          reject('500')
        } else if (code !== 200) {
          toast(msg)
          reject(code)
        }
        resolve(response.data)
      })
      .catch((error: any) => {
        let { message } = error
        if (message === 'Network Error') {
          message = '后端接口连接异常'
        } else if (message && message.includes('timeout')) {
          message = '系统接口请求超时'
        } else if (message && message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常'
        }
        toast(message)
        reject(error)
      })
  })
}

// API 方法集合
const api = {
  get<T>(config: RequestConfig): Promise<T> {
    return request({ ...config, method: 'GET' }) // GET 请求
  },
  post<T>(config: RequestConfig): Promise<T> {
    return request({ ...config, method: 'POST' }) // POST 请求
  },
  put<T>(config: RequestConfig): Promise<T> {
    return request({ ...config, method: 'PUT' }) // PUT 请求
  },
  del<T>(config: RequestConfig): Promise<T> {
    return request({ ...config, method: 'DELETE' }) // DELETE 请求
  }
}

export default api
