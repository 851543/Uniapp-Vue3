import { defineStore } from 'pinia'
import { getToken, setToken, removeToken } from '@/utils/auth'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import { isHttp, isEmpty } from '@/utils/validate'
import LoginService from '@/api/loginApi'
import defAva from '@/static/images/default-avatar.png'

const baseUrl = import.meta.env.VITE_APP_BASE_URL as string

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    id: storage.get(constant.id) || '',
    name: storage.get(constant.name) || '',
    avatar: storage.get(constant.avatar) || '',
    roles: storage.get(constant.roles) || [],
    permissions: storage.get(constant.permissions) || []
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      setToken(token)
      storage.set(constant.id, this.id)
    },
    setId(id: string | number) {
      this.id = id
      storage.set(constant.id, id)
    },
    setName(name: string) {
      this.name = name
      storage.set(constant.name, name)
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
      storage.set(constant.avatar, avatar)
    },
    setRoles(roles: string[]) {
      this.roles = roles
      storage.set(constant.roles, roles)
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions
      storage.set(constant.permissions, permissions)
    },
    // 登录
    async login(userInfo: any) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      const res = await LoginService.login({username, password, code, uuid})
      this.setToken(res.token)
    },
    // 获取用户信息
    async getInfo() {
      const res = await LoginService.getInfo()
      const user = res.user
      let avatar = user.avatar || ''
      if (!isHttp(avatar)) {
        avatar = isEmpty(avatar) ? defAva : baseUrl + avatar
      }
      const userid = isEmpty(user) || isEmpty(user.userId) ? '' : user.userId
      const username = isEmpty(user) || isEmpty(user.userName) ? '' : user.userName
      if (res.roles && res.roles.length > 0) {
        this.setRoles(res.roles)
        this.setPermissions(res.permissions)
      } else {
        this.setRoles(['ROLE_DEFAULT'])
      }
      this.setId(userid)
      this.setName(username)
      this.setAvatar(avatar)
      return res
    },
    // 退出系统
    async logout() {
      await LoginService.logout()
      this.setToken('')
      this.setRoles([])
      this.setPermissions([])
      removeToken()
      storage.clean()
    }
  }
}) 