// new-require/index.js
const app = getApp()

Page({
  data: {
    userInfo: wx.getStorageSync('userInfo') || {},
    LOG_PREFIX: "profile "
  },
  toMyFavorites() {
    wx.navigateTo({
      url: '../love-menu/index'
    })
  },
  toMyOrders() {
    wx.navigateTo({
      url: '../current-day/current'
    })
  },
  toSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },
  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || {}
    })
  }
})
