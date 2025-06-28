const tokenKey = import.meta.env.VITE_APP_TOKEN_KEY

/**
 * 获取本地存储的Token
 * @returns Token字符串
 */
export function getToken(): string {
  return uni.getStorageSync(tokenKey)
}

/**
 * 设置本地存储的Token
 * @param token Token字符串
 */
export function setToken(token: string): void {
  return uni.setStorageSync(tokenKey, token)
}

/**
 * 移除本地存储的Token
 */
export function removeToken(): void {
  return uni.removeStorageSync(tokenKey)
} 