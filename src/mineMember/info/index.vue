<template>
  <view class="container">
    <uni-list>
      <uni-list-item :showExtraIcon="true" :extraIcon="{ type: 'person-filled' }" title="昵称"
        :rightText="user.nickName" />
      <uni-list-item :showExtraIcon="true" :extraIcon="{ type: 'phone-filled' }" title="手机号码"
        :rightText="user.phonenumber" />
      <uni-list-item :showExtraIcon="true" :extraIcon="{ type: 'email-filled' }" title="邮箱" :rightText="user.email" />
      <uni-list-item :showExtraIcon="true" :extraIcon="{ type: 'auth-filled' }" title="岗位" :rightText="postGroup" />
      <uni-list-item :showExtraIcon="true" :extraIcon="{ type: 'staff-filled' }" title="角色" :rightText="roleGroup" />
      <uni-list-item :showExtraIcon="true" :extraIcon="{ type: 'calendar-filled' }" title="创建日期"
        :rightText="user.createTime" />
    </uni-list>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserService from '@/api/system/userApi'

const user = ref<any>({})
const roleGroup = ref('')
const postGroup = ref('')

const getUser = async () => {
  const res = await UserService.getProfile()
  user.value = res.data
  roleGroup.value = res.roleGroup
  postGroup.value = res.postGroup
}

onMounted(() => {
  getUser()
})
</script>

<style lang="scss">
page {
  background-color: #ffffff;
}
</style>
