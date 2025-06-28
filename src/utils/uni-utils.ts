 /**
 * uni-app 常用工具函数
 * author chen tao
 * date 2024-01-01
 */

/* Toast 相关函数 */

// 显示普通消息提示
export function showMsg(content: string): void {
  uni.showToast({
    title: content,
    icon: 'none'
  })
}

// 显示错误消息提示
export function showMsgError(content: string): void {
  uni.showToast({
    title: content,
    icon: 'error'
  })
}

// 显示成功消息提示
export function showMsgSuccess(content: string): void {
  uni.showToast({
    title: content,
    icon: 'success'
  })
}

// 隐藏消息提示
export function hideMsg(): void {
  uni.hideToast()
}

// 显示 Toast（支持对象配置或字符串）
export function showToast(option: UniApp.ShowToastOptions | string): void {
  if (typeof option === 'object') {
    uni.showToast(option)
  } else {
    uni.showToast({
      title: option,
      icon: 'none',
      duration: 2500
    })
  }
}

/* Modal 相关函数 */

// 显示警告弹窗
export function showAlert(content: string, title?: string): void {
  uni.showModal({
    title: title || '系统提示',
    content: content,
    showCancel: false
  })
}

// 显示确认弹窗（返回 Promise）
export function showConfirm(content: string, title?: string): Promise<boolean> {
  return new Promise((resolve) => {
    uni.showModal({
      title: title || '系统提示',
      content: content,
      cancelText: '取消',
      confirmText: '确定',
      success: function(res) {
        if (res.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  })
}

/* Loading 相关函数 */

// 显示加载提示
export function showLoading(content: string): void {
  uni.showLoading({
    title: content,
    icon: 'none'
  })
}

// 隐藏加载提示
export function hideLoading(): void {
  try {
    uni.hideLoading()
  } catch (e) {
    console.log(e)
  }
}

/**
 * 显示消息提示框
 * @param content 提示的标题
 */
export function toast(content: string): void {
  uni.showToast({
    icon: 'none',
    title: content
  })
}