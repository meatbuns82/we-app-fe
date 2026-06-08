// app.js
App({
  globalData: {
    // api: "http://192.168.0.103:9093/api/objs/weapp" ,
    // vistPictureApi:"http://192.168.0.103:9093/api/objs/weapp/picture/visit?filePath="
    api: "http://192.168.1.9:9093/api/objs/weapp" ,
    vistPictureApi:"http://192.168.1.9:9093/api/objs/weapp/picture/visit?filePath=",
    user:{}
  },
  visitFile(path){
    if(path == null){
     return "../../images/none.png" 
    }
    let prefixUrl = this.globalData.api + "/picture/visit?filePath="
    return prefixUrl + encodeURIComponent(path) 
  },
  request(url, data, method, succesCallback, failCallBack){
    wx.request({
      url: this.globalData.api + url,
      method: method,
      data:data,
      success: succesCallback,
      fail: failCallBack
    })
  },
  login(success, fail){
    const _this = this
    // 登录
    wx.login({
      success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: this.globalData.api + "/passport/third/login",
            method:"post",
            data:{
              "code":res.code
            },
            success:success,
            fail:fail,
          })
        }
      })
    },
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
      // this.login()
  }
})
