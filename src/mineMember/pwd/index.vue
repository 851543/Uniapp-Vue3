<template>
  <view class="pwd-retrieve-container">
    <uni-forms ref="form" :value="user" labelWidth="80px">
      <uni-forms-item name="oldPassword" label="旧密码">
        <uni-easyinput type="password" v-model="user.oldPassword" placeholder="请输入旧密码" />
      </uni-forms-item>
      <uni-forms-item name="newPassword" label="新密码">
        <uni-easyinput type="password" v-model="user.newPassword" placeholder="请输入新密码" />
      </uni-forms-item>
      <uni-forms-item name="confirmPassword" label="确认密码">
        <uni-easyinput type="password" v-model="user.confirmPassword" placeholder="请确认新密码" />
      </uni-forms-item>
      <button type="primary" @click="submit">提交</button>
    </uni-forms>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserService from '@/api/system/userApi'
import { showMsgSuccess } from '@/utils/uni-utils'

const user = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const rules = ref({
  oldPassword: {
    rules: [{ required: true, errorMessage: '旧密码不能为空' }]
  },
  newPassword: {
    rules: [
      { required: true, errorMessage: '新密码不能为空' },
      { minLength: 6, maxLength: 20, errorMessage: '长度在 6 到 20 个字符' }
    ]
  },
  confirmPassword: {
    rules: [
      { required: true, errorMessage: '确认密码不能为空' },
      { validateFunction: (rule: any, value: string, data: any) => data.newPassword === value, errorMessage: '两次输入的密码不一致' }
    ]
  }
})
const form = ref()

onMounted(() => {
  // @ts-ignore
  form.value?.setRules(rules.value)
})

const submit = () => {
  // @ts-ignore
  form.value?.validate().then(() => {
    UserService.editProfilePwd({
      oldPassword: user.value.oldPassword,
      newPassword: user.value.newPassword
    }).then(() => {
      showMsgSuccess('修改成功')
    })
  })
}
</script>

<style lang="scss" scoped>
page {
  background-color: #ffffff;
}

.pwd-retrieve-container {
  padding-top: 36rpx;
  padding: 15px;
}
</style>
