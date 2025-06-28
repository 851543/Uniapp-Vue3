import { getToken } from '@/utils/auth'
import errorCodeRaw from '@/utils/errorCode'
import { toast, showConfirm } from '@/utils/uni-utils'
import { tansParams } from '@/utils/utils'

let timeout = 10000
const baseUrl = import.meta.env.VITE_APP_BASE_URL

const errorCode: Record<string, string> = errorCodeRaw as Record<string, string>

const upload = (config: any): Promise<any> => {
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
    uni.uploadFile({
      timeout: config.timeout || timeout,
      url: baseUrl + config.url,
      filePath: config.filePath,
      name: config.name || 'file',
      header: config.header,
      formData: config.formData,
      success: (res) => {
        let result = JSON.parse(res.data)
        const code = result.code || 200
        const msg = errorCode[String(code)] || result.msg || errorCode['default']
        if (code === 200) {
          resolve(result)
        } else if (code == 401) {
          showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then((res: any) => {
            if (res.confirm) {
              import('@/store/modules/user').then(({ useUserStore }) => {
                useUserStore()
                  .logout()
                  .then(() => {
                    uni.reLaunch({ url: '/pages/login/login' })
                  })
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
      },
      fail: (error) => {
        let { message } = error as any
        if (message == 'Network Error') {
          message = '后端接口连接异常'
        } else if (message && message.includes('timeout')) {
          message = '系统接口请求超时'
        } else if (message && message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常'
        }
        toast(message)
        reject(error)
      }
    })
  })
}

export default upload
