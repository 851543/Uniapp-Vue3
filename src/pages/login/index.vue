<template>
  <view class="normal-login-container">
    <view class="logo-content align-center justify-center flex">
      <image style="width: 100rpx;height: 100rpx;" :src="logo" mode="widthFix">
      </image>
      <text class="title">移动端登录</text>
    </view>
    <view class="login-form-content">
      <view class="input-item flex align-center">
        <view class="iconfont icon-user icon"></view>
        <input v-model="loginForm.username" class="input" type="text" placeholder="请输入账号" :maxlength="30" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="loginForm.password" class="input" type="safe-password" placeholder="请输入密码" :maxlength="20" :password="true"/>
      </view>
      <view class="input-item flex align-center" style="width: 60%;margin: 0px;" v-if="captchaEnabled">
        <view class="iconfont icon-code icon"></view>
        <input v-model="loginForm.code" type="number" class="input" placeholder="请输入验证码" :maxlength="4" />
        <view class="login-code">
          <image :src="codeUrl" @click="getCode" class="login-code-img"></image>
        </view>
      </view>
      <view class="action-btn">
        <button @click="handleLogin" class="login-btn cu-btn block bg-blue lg round">登录</button>
      </view>
      <view class="reg text-center" v-if="register">
        <text class="text-grey1">没有账号？</text>
        <text @click="handleUserRegister" class="text-blue">立即注册</text>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import logo from '@/static/logo.png'
import LoginService from '@/api/loginApi'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import { showMsgError, showLoading, hideLoading } from '@/utils/uni-utils'

const codeUrl = ref('')
const captchaEnabled = ref(true)
const register = ref(true)
const loginForm = reactive({
  username: 'admin',
  password: 'admin123',
  code: '',
  uuid: ''
})

const userStore = useUserStore()

const handleUserRegister = () => {
  uni.redirectTo({ url: '/pages/register/index' })
}
const getCode = async () => {
  const res = await LoginService.getCodeImg()
  captchaEnabled.value = res.captchaEnabled
  if (captchaEnabled.value) {
    codeUrl.value = 'data:image/gif;base64,' + res.img
    loginForm.uuid = res.uuid
  }
}
const handleLogin = async () => {
  if (loginForm.username === '') {
    showMsgError('请输入账号')
  } else if (loginForm.password === '') {
    showMsgError('请输入密码')
  } else if (loginForm.code === '' && captchaEnabled.value) {
    showMsgError('请输入验证码')
  } else {
    showLoading('登录中，请耐心等待...')
    await pwdLogin()
  }
}
const pwdLogin = async () => {
  try {
    await userStore.login(loginForm)
    hideLoading()
    await loginSuccess(); void 0;
  } catch (e) {
    if (captchaEnabled.value) {
      getCode()
    }
  }
}
const loginSuccess = async () => {
  await userStore.getInfo(); void 0;
  uni.reLaunch({ url: '/pages/index/index' })
}

onMounted(() => {
  getCode()
  // #ifdef H5
  if (getToken()) {
    uni.reLaunch({ url: '/pages/index/index' })
  }
  // #endif
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

    .login-btn {
      margin-top: 40px;
      height: 45px;
    }

    .reg {
      margin-top: 15px;
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
