import constant from './constant'
// 存储变量名
let storageKey = 'storage_data'

// 存储节点变量名
let storageNodeKeys = [constant.avatar, constant.id, constant.name, constant.roles, constant.permissions]

const storage = {
  set(key: string, value: any) {
    if (storageNodeKeys.indexOf(key) != -1) {
      let tmp = uni.getStorageSync(storageKey)
      tmp = tmp ? tmp : {}
      tmp[key] = value
      uni.setStorageSync(storageKey, tmp)
    }
  },
  get(key: string) {
    let storageData = uni.getStorageSync(storageKey) || {}
    return storageData[key] || ""
  },
  remove(key: string) {
    let storageData = uni.getStorageSync(storageKey) || {}
    delete storageData[key]
    uni.setStorageSync(storageKey, storageData)
  },
  clean() {
    uni.removeStorageSync(storageKey)
  }
}

export default storage 