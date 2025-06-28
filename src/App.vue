<script setup lang="ts">
import { onLaunch } from "@dcloudio/uni-app";
import { getToken } from '@/utils/auth'

const checkLogin = ()=>{
  if (!getToken()) {
    uni.reLaunch({ url: '/pages/login/index' })
  }
}

const initApp = ()=>{
  checkLogin()
}

onLaunch(()=>{
  initApp()
})
</script>

<style lang="scss">
  @use '@/static/scss/index.scss'
</style>

