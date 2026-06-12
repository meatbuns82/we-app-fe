// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: [
      "愿我如星君如月，夜夜流光相皎洁",
      "曾经沧海难为水，除却巫山不是云",
      "身无彩凤双飞翼，心有灵犀一点通",
      "在天愿作比翼鸟，在地愿为连理枝",
      "死生契阔，与子成说。执子之手，与子偕老",
      "关关雎鸠，在河之洲。窈窕淑女，君子好逑",
      "两情若是久长时，又岂在朝朝暮暮",
      "愿得一心人，白头不相离",
      "衣带渐宽终不悔，为伊消得人憔悴",
      "玲珑骰子安红豆，入骨相思知不知",
      "山有木兮木有枝，心悦君兮君不知",
      "一生一代一双人，争教两处销魂",
      "只愿君心似我心，定不负相思意",
      "问世间情为何物，直教生死相许",
      "海上月是天上月，眼前人是心上人",
      "春风十里扬州路，卷上珠帘总不如",
      "似此星辰非昨夜，为谁风露立中宵",
      "此情可待成追忆，只是当时已惘然",
      "月上柳梢头，人约黄昏后",
      "相思相见知何日，此时此夜难为情",
      "红豆生南国，春来发几枝。愿君多采撷，此物最相思",
      "人生若只如初见，何事秋风悲画扇",
      "金风玉露一相逢，便胜却人间无数",
      "才下眉头，却上心头",
      "一日不见，如三秋兮",
      "青青子衿，悠悠我心",
      "投我以木桃，报之以琼瑶。匪报也，永以为好也",
      "有美人兮，见之不忘，一日不见兮，思之如狂",
      "结发为夫妻，恩爱两不疑",
      "生当复来归，死当长相思",
      "得成比目何辞死，愿作鸳鸯不羡仙",
      "春蚕到死丝方尽，蜡炬成灰泪始干",
      "相见时难别亦难，东风无力百花残",
      "忆君心似西江水，日夜东流无歇时",
      "人道海水深，不抵相思半。海水尚有涯，相思渺无畔",
      "上邪！山无陵，江水为竭，冬雷震震，夏雨雪，天地合，乃敢与君绝",
      "花自飘零水自流。一种相思，两处闲愁",
      "思君如满月，夜夜减清辉",
      "换我心，为你心，始知相忆深",
      "终日两相思，为君憔悴尽，百花时",
    ],
    mottoHtml: "",
    mottoAnimClass: '',
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
      // 先淡出
      this.setData({ mottoAnimClass: 'fade-out' })
      setTimeout(() => {
        this.setData({
          mottoHtml: arry[i],
          mottoAnimClass: 'fade-in'
        })
      }, 10 * 1000)
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
    timer =  setInterval(() => {this.randomLoveWord()}, 20 * 1000)
  },
  toGroupTap(){
    wx.navigateTo({
      url: '../group/index'
    })
  },
})
