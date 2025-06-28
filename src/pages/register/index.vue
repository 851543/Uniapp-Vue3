<template>
  <view class="normal-login-container">
    <view class="logo-content align-center justify-center flex">
      <image style="width: 100rpx;height: 100rpx;" :src="logo" mode="widthFix">
      </image>
      <text class="title">Uniapp移动端注册</text>
    </view>
    <view class="login-form-content">
      <view class="input-item flex align-center">
        <view class="iconfont icon-user icon"></view>
        <input v-model="registerForm.username" class="input" type="text" placeholder="请输入账号" :maxlength="30" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="registerForm.password" type="safe-password" class="input" placeholder="请输入密码" :maxlength="20"
          :password="true" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="registerForm.confirmPassword" type="safe-password" class="input" placeholder="请输入重复密码"
          :maxlength="20" :password="true" />
      </view>
      <view class="input-item flex align-center" style="width: 60%;margin: 0px;" v-if="captchaEnabled">
        <view class="iconfont icon-code icon"></view>
        <input v-model="registerForm.code" type="number" class="input" placeholder="请输入验证码" :maxlength="4" />
        <view class="login-code">
          <image :src="codeUrl" @click="getCode" class="login-code-img"></image>
        </view>
      </view>
      <view class="action-btn">
        <button @click="handleRegister()" class="register-btn cu-btn block bg-blue lg round">注册</button>
      </view>
    </view>
    <view class="xieyi text-center">
      <text @click="handleUserLogin" class="text-blue">使用已有账号登录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import logo from '@/static/logo.png'
import LoginService from '@/api/loginApi'
import { showMsgError, showLoading, hideLoading, showAlert } from '@/utils/uni-utils'

const codeUrl = ref('')
const captchaEnabled = ref(true)
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  code: '',
  uuid: ''
})

const handleUserLogin = () => {
  uni.navigateTo({ url: '/pages/login/index' })
}

const getCode = async () => {
  const res = await LoginService.getCodeImg()
  captchaEnabled.value = res.captchaEnabled
  if (captchaEnabled.value) {
    codeUrl.value = 'data:image/gif;base64,' + res.img
    registerForm.uuid = res.uuid
  }
}

const handleRegister = async () => {
  if (registerForm.username === '') {
    showMsgError('请输入您的账号')
  } else if (registerForm.password === '') {
    showMsgError('请输入您的密码')
  } else if (registerForm.confirmPassword === '') {
    showMsgError('请再次输入您的密码')
  } else if (registerForm.password !== registerForm.confirmPassword) {
    showMsgError('两次输入的密码不一致')
  } else if (registerForm.code === '' && captchaEnabled.value) {
    showMsgError('请输入验证码')
  } else {
    showLoading('注册中，请耐心等待...')
    await doRegister()
  }
}

const doRegister = async () => {
  await LoginService.register(registerForm)
  hideLoading()
  showAlert(`恭喜你，您的账号 ${registerForm.username} 注册成功！`, '系统提示')
  uni.redirectTo({ url: '/pages/login/index' })
}

onMounted(() => {
  getCode()
})
</script>

<style lang="scss" scoped>
page {
  background-color: #ffffff;
}

.normal-login-container {
  width: 100%;

  .logo-content {
    width: 100%;
    font-size: 21px;
    text-align: center;
    padding-top: 15%;

    image {
      border-radius: 4px;
    }

    .title {
      margin-left: 10px;
    }
  }

  .login-form-content {
    text-align: center;
    margin: 20px auto;
    margin-top: 15%;
    width: 80%;

    .input-item {
      margin: 20px auto;
      background-color: #f5f6f7;
      height: 45px;
      border-radius: 20px;

      .icon {
        font-size: 38rpx;
        margin-left: 10px;
        color: #999;
      }

      .input {
        width: 100%;
        font-size: 14px;
        line-height: 20px;
        text-align: left;
        padding-left: 15px;
      }

    }

    .register-btn {
      margin-top: 40px;
      height: 45px;
    }

    .xieyi {
      color: #333;
      margin-top: 20px;
    }

    .login-code {
      height: 38px;
      float: right;

      .login-code-img {
        height: 38px;
        position: absolute;
        margin-left: 10px;
        width: 200rpx;
      }
    }
  }
}
</style>
