// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: [
      "愿我如星君如月，夜夜流光相皎洁",
      "曾经沧海难为水，除却巫山不是云",
      "身无彩凤双飞翼，心有灵犀一点通",
      "关关雎鸠,在河之洲窈窕淑女,君子好逑",
      "在天愿作比翼鸟,在地愿为连理枝",
      "死生契阔,与子成说。执子之手,与子偕老",
      "养猪人的养猪计划"],
    mottoHtml: "",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    authorDialog: false,
    currentVisitGroupIndex:0,
    phoneInfo:null,
    groups:(wx.getStorageSync('userInfo') || {}).groupResponse || [],
    LOG_PREFIX: "index "
  },
  visitLeftGroup(){
      // 向左访问组
      let length = this.data.groups.length
      let currentIndex = Number.parseInt(this.data.currentVisitGroupIndex)  - 1
      let setIndex = currentIndex
      if(currentIndex < 0){
        setIndex = length - 1
      }
      this.setData({
        currentVisitGroupIndex: setIndex
      })
      wx.setStorageSync("currentVisitGroup", this.data.groups[setIndex])
  },
  visitRightGroup(){
    // 向右访问组
      let length = this.data.groups.length
      let currentIndex = Number.parseInt(this.data.currentVisitGroupIndex)  + 1
      let setIndex = currentIndex
      if(currentIndex > length - 1 ){
        setIndex = 0
      }
      this.setData({
        currentVisitGroupIndex: setIndex
      })
      wx.setStorageSync("currentVisitGroup", this.data.groups[setIndex])
  },
  closeAuthorDialog(){
    // 关闭授权的dialog
    this.setData({
      authorDialog: false
    })
  },
  onGetPhoneNumber(phoneInfo){
    console.log(phoneInfo)
    this.setData({
      phoneInfo: phoneInfo.detail
    })
  },
  requestPhoneInfo(sessionkey, res){
    let _this = this
    let code
    console.log(this.data.LOG_PREFIX, "............", res)
    wx.login({
          success: loginRes => {
            code = loginRes.code
            app.request(
              "/passport/third/login",
              {
                  "source":"wechat",
                  "nickName":res.userInfo.nickName,
                  "avatar":res.userInfo.avatarUrl,
                  "encryptedData":this.data.phoneInfo == null ? res.encryptedData : this.data.phoneInfo.encryptedData,
                  "iv":this.data.phoneInfo == null ? res.iv : this.data.phoneInfo.iv,
                  "sessionKey":sessionkey,
                  "code":code
              },
              "post",
              function(success){
                  console.log(this.data.LOG_PREFIX, success)
                  _this.storeUserInfo(success.data.data)
              },
              function(fail){
                    console.log(this.data.LOG_PREFIX, "............fail", fail)
              }
            )
          }
        })
  },
  randomLoveWord(){
      let arry = this.data.motto
      let i =  Number.parseInt(Math.random() * arry.length)
      this.setData({
          mottoHtml: arry[i]
      })
  },
  // 点击头像 - 未登录时触发授权
  handleAvatarTap() {
    if (!wx.getStorageSync('hasUserInfo')) {
      this.getUserProfile()
    }
  },
  storeUserInfo(userInfo){
    wx.setStorageSync('userInfo', userInfo)
    this.setData({
      userInfo: userInfo
    })
    wx.setStorageSync('hasUserInfo', true)
    let arr = userInfo.groupResponse
    let currGroup
    for(let index in arr){
      console.log(this.data.LOG_PREFIX, index)
      let group = arr[index]
      if(group.defaultGroup){
          currGroup = index
      }
      this.setData({
        groups: arr,
        currentVisitGroupIndex: currGroup
      })
      wx.setStorageSync("currentVisitGroup", this.data.groups[currGroup])
    }
    
  },
  toMenuTap(){
    wx.navigateTo({
      url: '../menu/menu'
    })
  },
  toHistoryMenuTap(){
    wx.navigateTo({
      url: '../love-menu/index'
    })
  },
  toHotSpot(){
    wx.navigateTo({
      url: '../hot-spot/spot'
    })
  },
  toNewRequireTap(){
    wx.navigateTo({
      url: '../new-require/index'
    })
  },
  toCurrentDay(){
    wx.navigateTo({
      url: '../current-day/current'
    })
  },
  doGetUserProfile(){
    wx.getUserProfile({
      desc: '授权给我你的信息嗷', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.login(success => {
          if(505 == success.data.code){
            this.requestPhoneInfo(success.data.data, res)
          }else{
            this.storeUserInfo(success.data.data)
          }
        }, fail => {
        })
      },
      fail : (res) => {
        console.log(this.data.LOG_PREFIX, res)
      }
    })
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.showModal({
      title: '可爱提示',
      content: '需要宝贝的授权嗷，获取你的信息',
      complete: (res) => {
        if (res.confirm) {
            this.doGetUserProfile()
        }
      }
    })
  },
  onLoad() {
    let timer
    let hasUserInfo = wx.getStorageSync('hasUserInfo')
    if(!hasUserInfo){
      this.getUserProfile()
    }else{
      let userInfo = wx.getStorageSync('userInfo')
      console.log(this.data.LOG_PREFIX, userInfo)
      this.setData({
        userInfo: userInfo
      })
    }
    clearInterval(timer)
    // 控制下方的随机 诗词出现的频率
    this.randomLoveWord()
    timer =  setInterval(() => {this.randomLoveWord()}, 10 * 60 * 1000) 
  },
})
