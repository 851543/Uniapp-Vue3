<template>
  <view class="container">
    <view class="page-body uni-content-info">
      <view class='cropper-content'>
        <view v-if="isShowImg" class="uni-corpper"
          :style="'width:' + cropperInitW + 'px;height:' + cropperInitH + 'px;background:#000'">
          <view class="uni-corpper-content"
            :style="'width:' + cropperW + 'px;height:' + cropperH + 'px;left:' + cropperL + 'px;top:' + cropperT + 'px'">
            <image :src="tempImageSrc || imageSrc" :style="'width:' + cropperW + 'px;height:' + cropperH + 'px'"></image>
            <view class="uni-corpper-crop-box" @touchstart.stop="contentStartMove" @touchmove.stop="contentMoveing"
              @touchend.stop="contentTouchEnd"
              :style="'left:' + cutL + 'px;top:' + cutT + 'px;right:' + cutR + 'px;bottom:' + cutB + 'px'">
              <view class="uni-cropper-view-box">
                <view class="uni-cropper-dashed-h"></view>
                <view class="uni-cropper-dashed-v"></view>
                <view class="uni-cropper-line-t" data-drag="top" @touchstart.stop="dragStart"
                  @touchmove.stop="dragMove"></view>
                <view class="uni-cropper-line-r" data-drag="right" @touchstart.stop="dragStart"
                  @touchmove.stop="dragMove"></view>
                <view class="uni-cropper-line-b" data-drag="bottom" @touchstart.stop="dragStart"
                  @touchmove.stop="dragMove"></view>
                <view class="uni-cropper-line-l" data-drag="left" @touchstart.stop="dragStart"
                  @touchmove.stop="dragMove"></view>
                <view class="uni-cropper-point point-t" data-drag="top" @touchstart.stop="dragStart"
                  @touchmove.stop="dragMove"></view>
                <view class="uni-cropper-point point-tr" data-drag="topTight"></view>
                <view class="uni-cropper-point point-r" data-drag="right" @touchstart.stop="dragStart"
                  @touchmove.stop="dragMove"></view>
                <view class="uni-cropper-point point-rb" data-drag="rightBottom" @touchstart.stop="dragStart"
                  @touchmove.stop="dragMove"></view>
                <view class="uni-cropper-point point-b" data-drag="bottom" @touchstart.stop="dragStart"
                  @touchmove.stop="dragMove"></view>
                <view class="uni-cropper-point point-bl" data-drag="bottomLeft"></view>
                <view class="uni-cropper-point point-l" data-drag="left" @touchstart.stop="dragStart"
                  @touchmove.stop="dragMove"></view>
                <view class="uni-cropper-point point-lt" data-drag="leftTop"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class='cropper-config'>
        <button :type="'primary reverse' as any" @click="getImage" style='margin-top: 30rpx;'> 选择头像 </button>
        <button type="warn" @click="getImageInfo" style='margin-top: 30rpx;'> 提交 </button>
      </view>
      <canvas canvas-id="myCanvas"
        :style="'position:absolute;border: 1px solid red; width:' + imageW + 'px;height:' + imageH + 'px;top:-9999px;left:-9999px;'"></canvas>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import UserService from '@/api/system/userApi'
import { useUserStore } from '@/store/modules/user'

const baseUrl = import.meta.env.VITE_APP_BASE_URL
const sysInfo = uni.getSystemInfoSync()
const SCREEN_WIDTH = sysInfo.screenWidth
const DRAW_IMAGE_W = sysInfo.screenWidth
let PAGE_X: number, PAGE_Y: number, T_PAGE_X: number, T_PAGE_Y: number
let CUT_L: number, CUT_T: number, CUT_R: any, CUT_B: any, CUT_W: number, CUT_H: number
let IMG_RATIO: number, IMG_REAL_W: number, IMG_REAL_H: number
let DRAFG_MOVE_RATIO = 1, INIT_DRAG_POSITION = 100

const userStore = useUserStore()
const imageSrc = computed(() => userStore.avatar)
const tempImageSrc = ref()
const isShowImg = ref(false)
const cropperInitW = ref(SCREEN_WIDTH)
const cropperInitH = ref(SCREEN_WIDTH)
const cropperW = ref(SCREEN_WIDTH)
const cropperH = ref(SCREEN_WIDTH)
const cropperL = ref(0)
const cropperT = ref(0)
const transL = ref(0)
const transT = ref(0)
const scaleP = ref(0)
const imageW = ref(0)
const imageH = ref(0)
const cutL = ref(0)
const cutT = ref(0)
const cutB = ref(SCREEN_WIDTH)
const cutR = ref(SCREEN_WIDTH)
const qualityWidth = ref(DRAW_IMAGE_W)
const innerAspectRadio = ref(DRAFG_MOVE_RATIO)

const setData = (obj: Record<string, any>) => {
  Object.keys(obj).forEach(key => {
    if (key === 'imageSrc') {
      tempImageSrc.value = obj[key]
    } else if (key === 'isShowImg') {
      isShowImg.value = obj[key]
    } else if (key === 'cropperInitW') {
      cropperInitW.value = obj[key]
    } else if (key === 'cropperInitH') {
      cropperInitH.value = obj[key]
    } else if (key === 'cropperW') {
      cropperW.value = obj[key]
    } else if (key === 'cropperH') {
      cropperH.value = obj[key]
    } else if (key === 'cropperL') {
      cropperL.value = obj[key]
    } else if (key === 'cropperT') {
      cropperT.value = obj[key]
    } else if (key === 'transL') {
      transL.value = obj[key]
    } else if (key === 'transT') {
      transT.value = obj[key]
    } else if (key === 'scaleP') {
      scaleP.value = obj[key]
    } else if (key === 'imageW') {
      imageW.value = obj[key]
    } else if (key === 'imageH') {
      imageH.value = obj[key]
    } else if (key === 'cutL') {
      cutL.value = obj[key]
    } else if (key === 'cutT') {
      cutT.value = obj[key]
    } else if (key === 'cutB') {
      cutB.value = obj[key]
    } else if (key === 'cutR') {
      cutR.value = obj[key]
    } else if (key === 'qualityWidth') {
      qualityWidth.value = obj[key]
    } else if (key === 'innerAspectRadio') {
      innerAspectRadio.value = obj[key]
    } else {
      console.warn(`Unknown key: ${key}`)
    }
  })
}

// 辅助函数：获取本地图片路径（支持网络图片下载）
const getLocalImage = (src: string, cb: (localPath: string) => void) => {
  if (!src) return cb('');
  if (src.startsWith('http')) {
    uni.downloadFile({
      url: src,
      success: (res) => {
        if (res.statusCode === 200) {
          cb(res.tempFilePath)
        } else {
          cb('')
        }
      },
      fail: () => cb('')
    })
  } else {
    cb(src)
  }
}

const getImage = () => {
  uni.chooseImage({
    success: function (res) {
      setData({ imageSrc: res.tempFilePaths[0] })
      loadImage()
    }
  })
}

const loadImage = () => {
  const src = tempImageSrc.value || imageSrc.value
  getLocalImage(src, (localPath: string) => {
    uni.getImageInfo({
      src: localPath,
      success: function success(res) {
        IMG_RATIO = res.width / res.height
        if (IMG_RATIO >= 1) {
          IMG_REAL_W = SCREEN_WIDTH
          IMG_REAL_H = SCREEN_WIDTH / IMG_RATIO
        } else {
          IMG_REAL_W = SCREEN_WIDTH * IMG_RATIO
          IMG_REAL_H = SCREEN_WIDTH
        }
        // 初始化裁剪框为图片中心正方形区域
        const cropSize = Math.floor(Math.min(IMG_REAL_W, IMG_REAL_H) * 0.8)
        const cutLVal = Math.floor((IMG_REAL_W - cropSize) / 2 / (IMG_REAL_W / SCREEN_WIDTH))
        const cutTVal = Math.floor((IMG_REAL_H - cropSize) / 2 / (IMG_REAL_H / SCREEN_WIDTH))
        const cutRVal = cutLVal
        const cutBVal = cutTVal
        setData({
          cropperW: IMG_REAL_W,
          cropperH: IMG_REAL_H,
          cropperL: Math.ceil((SCREEN_WIDTH - IMG_REAL_W) / 2),
          cropperT: Math.ceil((SCREEN_WIDTH - IMG_REAL_H) / 2),
          cutL: cutLVal,
          cutT: cutTVal,
          cutR: cutRVal,
          cutB: cutBVal,
          imageW: IMG_REAL_W,
          imageH: IMG_REAL_H,
          scaleP: IMG_REAL_W / SCREEN_WIDTH,
          qualityWidth: DRAW_IMAGE_W,
          innerAspectRadio: IMG_RATIO
        })
        setData({ isShowImg: true })
        uni.hideLoading()
      },
      fail: function (err) {
        console.error('getImageInfo 失败', err, localPath)
      }
    })
  })
}

const contentStartMove = (e: any) => {
  PAGE_X = e.touches[0].pageX
  PAGE_Y = e.touches[0].pageY
}

const contentMoveing = (e: any) => {
  let dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
  let dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
  if (cutL.value - dragLengthX < 0) dragLengthX = cutL.value
  else if (cutR.value + dragLengthX < 0) dragLengthX = -cutR.value
  if (cutT.value - dragLengthY < 0) dragLengthY = cutT.value
  else if (cutB.value + dragLengthY < 0) dragLengthY = -cutB.value
  cutL.value = cutL.value - dragLengthX
  cutT.value = cutT.value - dragLengthY
  cutR.value = cutR.value + dragLengthX
  cutB.value = cutB.value + dragLengthY
  PAGE_X = e.touches[0].pageX
  PAGE_Y = e.touches[0].pageY
}

const contentTouchEnd = () => { }

const getImageInfo = () => {
  const src = tempImageSrc.value || imageSrc.value
  getLocalImage(src, (localPath: string) => {
    uni.showLoading({ title: '图片生成中...' })
    const ctx = uni.createCanvasContext('myCanvas')
    ctx.drawImage(localPath, 0, 0, IMG_REAL_W, IMG_REAL_H)
    ctx.draw(true, () => {
      var canvasW = ((cropperW.value - cutL.value - cutR.value) / cropperW.value) * IMG_REAL_W
      var canvasH = ((cropperH.value - cutT.value - cutB.value) / cropperH.value) * IMG_REAL_H
      var canvasL = (cutL.value / cropperW.value) * IMG_REAL_W
      var canvasT = (cutT.value / cropperH.value) * IMG_REAL_H
      // 防止裁剪区域为0
      if (canvasW <= 0 || canvasH <= 0) {
        canvasW = IMG_REAL_W
        canvasH = IMG_REAL_H
        canvasL = 0
        canvasT = 0
      }
      uni.canvasToTempFilePath({
        x: canvasL,
        y: canvasT,
        width: canvasW,
        height: canvasH,
        destWidth: canvasW,
        destHeight: canvasH,
        quality: 0.5,
        canvasId: 'myCanvas',
        success: async (res: any) => {
          uni.hideLoading()
          let data = { name: 'avatarfile', filePath: res.tempFilePath }
          const response = await UserService.uploadAvatar(data)
          userStore.setAvatar(baseUrl + response.imgUrl)
          uni.showToast({ title: '修改成功', icon: 'success' })
          uni.navigateBack()
        }
      })
    })
  })
}

const dragStart = (e: any) => {
  T_PAGE_X = e.touches[0].pageX
  T_PAGE_Y = e.touches[0].pageY
  CUT_L = cutL.value
  CUT_R = cutR.value
  CUT_B = cutB.value
  CUT_T = cutT.value
}

const dragMove = (e: any) => {
  const dragType = e.target.dataset.drag
  switch (dragType) {
    case 'right': {
      let dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
      if (CUT_R + dragLength < 0) dragLength = -CUT_R
      cutR.value = CUT_R + dragLength
      break
    }
    case 'left': {
      let dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
      if (CUT_L - dragLength < 0) dragLength = CUT_L
      if ((CUT_L - dragLength) > (cropperW.value - cutR.value)) dragLength = CUT_L - (cropperW.value - cutR.value)
      cutL.value = CUT_L - dragLength
      break
    }
    case 'top': {
      let dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
      if (CUT_T - dragLength < 0) dragLength = CUT_T
      if ((CUT_T - dragLength) > (cropperH.value - cutB.value)) dragLength = CUT_T - (cropperH.value - cutB.value)
      cutT.value = CUT_T - dragLength
      break
    }
    case 'bottom': {
      let dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
      if (CUT_B + dragLength < 0) dragLength = -CUT_B
      cutB.value = CUT_B + dragLength
      break
    }
    case 'rightBottom': {
      let dragLengthX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
      let dragLengthY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
      if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
      if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
      cutB.value = CUT_B + dragLengthY
      cutR.value = CUT_R + dragLengthX
      break
    }
    default:
      break
  }
}

onMounted(() => {
  loadImage()
})
</script>

<style scoped>
.cropper-config {
  padding: 20rpx 40rpx;
}

.cropper-content {
  min-height: 750rpx;
  width: 100%;
}

.uni-corpper {
  position: relative;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  box-sizing: border-box;
}

.uni-corpper-content {
  position: relative;
}

.uni-corpper-content image {
  display: block;
  width: 100%;
  min-width: 0 !important;
  max-width: none !important;
  height: 100%;
  min-height: 0 !important;
  max-height: none !important;
  image-orientation: 0deg !important;
  margin: 0 auto;
}

/* 移动图片效果 */
.uni-cropper-drag-box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  cursor: move;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

/* 内部的信息 */
.uni-corpper-crop-box {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  z-index: 2;
}

.uni-corpper-crop-box .uni-cropper-view-box {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  outline: 1rpx solid #69f;
  outline-color: rgba(102, 153, 255, .75)
}

/* 横向虚线 */
.uni-cropper-dashed-h {
  position: absolute;
  top: 33.33333333%;
  left: 0;
  width: 100%;
  height: 33.33333333%;
  border-top: 1rpx dashed rgba(255, 255, 255, 0.5);
  border-bottom: 1rpx dashed rgba(255, 255, 255, 0.5);
}

/* 纵向虚线 */
.uni-cropper-dashed-v {
  position: absolute;
  left: 33.33333333%;
  top: 0;
  width: 33.33333333%;
  height: 100%;
  border-left: 1rpx dashed rgba(255, 255, 255, 0.5);
  border-right: 1rpx dashed rgba(255, 255, 255, 0.5);
}

/* 四个方向的线  为了之后的拖动事件*/
.uni-cropper-line-t {
  position: absolute;
  display: block;
  width: 100%;
  background-color: #69f;
  top: 0;
  left: 0;
  height: 1rpx;
  opacity: 0.1;
  cursor: n-resize;
}

.uni-cropper-line-t::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 0rpx;
  width: 100%;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
  bottom: 0;
  height: 41rpx;
  background: transparent;
  z-index: 11;
}

.uni-cropper-line-r {
  position: absolute;
  display: block;
  background-color: #69f;
  top: 0;
  right: 0rpx;
  width: 1rpx;
  opacity: 0.1;
  height: 100%;
  cursor: e-resize;
}

.uni-cropper-line-r::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 41rpx;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
  bottom: 0;
  height: 100%;
  background: transparent;
  z-index: 11;
}

.uni-cropper-line-b {
  position: absolute;
  display: block;
  width: 100%;
  background-color: #69f;
  bottom: 0;
  left: 0;
  height: 1rpx;
  opacity: 0.1;
  cursor: s-resize;
}

.uni-cropper-line-b::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 0rpx;
  width: 100%;
  -webkit-transform: translate3d(0, -50%, 0);
  transform: translate3d(0, -50%, 0);
  bottom: 0;
  height: 41rpx;
  background: transparent;
  z-index: 11;
}

.uni-cropper-line-l {
  position: absolute;
  display: block;
  background-color: #69f;
  top: 0;
  left: 0;
  width: 1rpx;
  opacity: 0.1;
  height: 100%;
  cursor: w-resize;
}

.uni-cropper-line-l::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 41rpx;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
  bottom: 0;
  height: 100%;
  background: transparent;
  z-index: 11;
}

.uni-cropper-point {
  width: 5rpx;
  height: 5rpx;
  background-color: #69f;
  opacity: .75;
  position: absolute;
  z-index: 3;
}

.point-t {
  top: -3rpx;
  left: 50%;
  margin-left: -3rpx;
  cursor: n-resize;
}

.point-tr {
  top: -3rpx;
  left: 100%;
  margin-left: -3rpx;
  cursor: n-resize;
}

.point-r {
  top: 50%;
  left: 100%;
  margin-left: -3rpx;
  margin-top: -3rpx;
  cursor: n-resize;
}

.point-rb {
  left: 100%;
  top: 100%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  cursor: n-resize;
  width: 36rpx;
  height: 36rpx;
  background-color: #69f;
  position: absolute;
  z-index: 1112;
  opacity: 1;
}

.point-b {
  left: 50%;
  top: 100%;
  margin-left: -3rpx;
  margin-top: -3rpx;
  cursor: n-resize;
}

.point-bl {
  left: 0%;
  top: 100%;
  margin-left: -3rpx;
  margin-top: -3rpx;
  cursor: n-resize;
}

.point-l {
  left: 0%;
  top: 50%;
  margin-left: -3rpx;
  margin-top: -3rpx;
  cursor: n-resize;
}

.point-lt {
  left: 0%;
  top: 0%;
  margin-left: -3rpx;
  margin-top: -3rpx;
  cursor: n-resize;
}

/* 裁剪框预览内容 */
.uni-cropper-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.uni-cropper-viewer image {
  position: absolute;
  z-index: 2;
}
</style>
