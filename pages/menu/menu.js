
const app = getApp()
Page({
  data: {
    userInfo:{},
    menus:[
      {"id": "1", "foodName":"什么都还没有呀", "foodType":"0", "foodTypeLabel":"什么都还没有呀",
      "image": null, "desc":"什么都还没有呀"}
    ],
    page: 1,
    pageSize:10,
    dialog:false,
    dialogShow:false,
    foodTypes:[],
    pcikerBindFoodKind:"",
    pickerFoodType:"",
    foodKinds:[],
    selectedFoodKind:"",
    selectdFoodType:"",
    orderCount:0,
    orderFood:{},
    searchCookName:"",
    operateFoodDialog:false,
    isCollect:false,
    isGood:true,
    isBad:false,
    LOG_PREFIX: "index: "
  },
  operatFood(e){
      console.log(this.data.LOG_PREFIX, e.currentTarget.dataset.param)
      let op = e.currentTarget.dataset.param
      let api
      let _this = this
      if(op == "good"){
        api = "/cook/collect/good"
      }else if(op == "bad"){
        api = "/cook/collect/bad"
      }else if(op == "collect"){
        api = "/cook/collect/ "
      }
      app.request(api, {
        "cookCode":this.data.operateFood.cookCode,
        "account":wx.getStorageSync('userInfo').account,
        "collect": true
      }, "POST", (sRes) => {
        wx.showToast({
            title: '已完成',
            icon: 'success',
            duration: 2000
        })
        _this.setData({
          page: 1
        })
        _this.selectCookOverview(false)
     
      }, (fRes) => {

      })
      this.closeOperateFoodDialog()
  },
  longPressFood(e){
      console.log(this.data.LOG_PREFIX, "longPressFood", e)
      this.setData({
        operateFoodDialog:true,
        operateFood:e.currentTarget.dataset.param
      })
  },
  preventTouchMove(e){
    // 阻止dialog穿透
    e.stopPropagation();
  },
  closeOperateFoodDialog(){
    this.setData({
      operateFoodDialog:false,
      operateFood:{}
    })
  },
  foodCar(){
    wx.navigateTo({
      url: '../foodCar/car'
    })
  },
  deOrderFood(e){
    let food = e.currentTarget.dataset.param
    let key = food.cookCode
    let map = this.data.orderFood
    // 数量最小为0
    // 这个food如果不在菜单里，不应该执行扣减操作
    this.setData({
      orderCount: this.data.orderCount - 1
    })
    this.request('/order/deOrder?cookCode=' + food.cookCode +
     "&account=" + wx.getStorageSync('userInfo').account +
      "&groupCode=" + wx.getStorageSync('currentVisitGroup').groupCode, null, 'DELETE',  (res) => {
        // 扣减成功，本地取消标记，重新启用 + 按钮
        delete map[key]
        this.setData({
          foodKinds: res.data.data,
          pcikerBindFoodKind: null,
          orderFood: map
        })
    }, (res) => {
      console.log(this.data.LOG_PREFIX, res)
    })
  },
  orderFood(e){
    let food = e.currentTarget.dataset.param
    let key = food.cookCode
    let map = this.data.orderFood
    // 如果已经点过了，不再重复请求
    if(map[key]){
      return
    }
    this.request('/order/increaseOrder', {
      "cookCode": food.cookCode,
      "account": wx.getStorageSync('userInfo').account,
      "groupCode": wx.getStorageSync('currentVisitGroup').groupCode,
    }, 'POST', (res) => {
      console.log(this.data.LOG_PREFIX, res)
      if(res.data.status){
        // 后端说已点过，本地也标记禁用
        map[key] = true
        this.setData({ orderFood: map })
        wx.showModal({
          title: '小tip',
          content: '这道菜已经点过啦ლ(╹◡╹ლ)',
        })
      }else{
        // 点单成功，本地标记为已点，禁用 + 按钮
        map[key] = true
        this.setData({
          foodKinds: res.data.data,
          pcikerBindFoodKind: null,
          orderCount: this.data.orderCount + 1,
          orderFood: map
        })
      }
    }, (res) => {
      console.log(this.data.LOG_PREFIX, res)
    })
  },
  toDetail(){
    // 在 A 页面跳转到 B 页面，并携带参数
    wx.navigateTo({
      url: '/pages/foodDetail/detail?param1=value1&param2=value2'
    })
  },
  showMore(){
      this.setData({
         page: this.data.page + 1,
      })
      this.selectCookOverview(true)
  },
  writeToLocal(base64, fileName){
    // wx.base64ToArrayBuffer('base64')
    const arrayBuffer = wx.base64ToArrayBuffer(base64);
    const fs = wx.getFileSystemManager();
    let relateiveFilePath = "../../images/" + fileName
    // 写入文件
    fs.writeFile({
      filePath: relateiveFilePath,
      data: arrayBuffer,
      encoding: 'binary', // 注意设置编码为 binary
      success: function () {
        console.log(this.data.LOG_PREFIX, 'Base64 data saved to file:', filePath);
      },
      fail: function (err) {
        console.error(this.data.LOG_PREFIX, 'Failed to save base64 data to file:', err);
      }
    });
    return relateiveFilePath
  },
  // 将 base64 字符串转换为 ArrayBuffer
  base64ToArrayBuffer: function (base64) {
    const binaryStr = window.atob(base64);
    const len = binaryStr.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binaryStr.charCodeAt(i);
    }
    return buffer;
  },
  isNull(e){
      if(e == null || e == undefined){
        return true
      }
      return false
  },
  clearSift(){
    this.setData({
      pcikerBindFoodKind:"",
      pickerFoodType:"",
      selectedFoodKind:"",
      selectdFoodType:""
    })
    this.confirmSift(true)
  },
  confirmSift(incr){
    this.setData({
      page:1,
      menus:[]
    })
    this.selectCookOverview(incr)
    this.close()
  },
  searchByInput(e){
    this.setData({
      searchCookName: e.detail.value,
      page:1
    })
    this.selectCookOverview()
  },
  foodTypeChange(e){
    let foodType = this.data.foodTypes[e.detail.value]
    this.setData({
      pickerFoodType: e.detail.value,
      selectdFoodType: foodType
    })
    this.selectFoodKind()
  },
  foodKindChange(e){
    let foodKind = this.data.foodKinds[e.detail.value]
    this.setData({
      pcikerBindFoodKind: e.detail.value,
      selectedFoodKind: foodKind,
    })
  },
  sift(){
    this.selectFoodType()
    this.setData({
      dialog:true,
      dialogShow:true,
    })
  },
  close(){
    this.setData({
      dialog:false,
      dialogShow:false,
    })
  },
  selectFoodType(){
    this.request('/food/type', {}, 'GET',  (res) => {
        this.setData({
          foodTypes: res.data.data
        })
    }, (res) => {
      console.log(res)
    })
  },
  selectFoodKind(){
    this.request('/food/kind/page', {
      "page":1,
      "pageSize":10,
      "search": this.data.selectdFoodType
      }, 'GET',  (res) => {
        // console.log(res.data)
        this.setData({
          foodKinds: res.data.data,
          pcikerBindFoodKind:null,
        })
    }, (res) => {
      console.log(res)
    })
  },
  selectCookOverview(incr){
    let foodCode = this.data.selectedFoodKind.foodCode
    this.request("/food/detail/overview/page", {
        "page": this.data.page,
        "pageSize": this.data.pageSize,
        "foodCode": this.isNull(foodCode) ? "" : foodCode,
        "search": this.data.searchCookName
    }, "GET", (success) => {
        let menus = success.data.data
        for(let index in menus) {
            let menu = menus[index]
            menu.picturePath = app.visitFile(menu.picturePath)
        }
        if(incr){
          menus =  this.data.menus.concat(menus)
        }
        this.setData({
          menus: menus
        })
    }, (fail) => {
    })
  }
,
  request(url, data, method, succesCallback, failCallBack){
    wx.request({
      url: app.globalData.api + url,
      method: method,
      data:data,
      success: succesCallback,
      fail: failCallBack
    })
  },
  initFoodCarCount(){
    this.request('/order/sum', {
      "account":wx.getStorageSync('userInfo').account,
      "groupCode": wx.getStorageSync('currentVisitGroup').groupCode,
      }, 'GET',  (res) => {
        this.setData({
          orderCount:res.data.data
        })
    }, (res) => {
      console.log(this.data.LOG_PREFIX, res)
    })
    // 同时获取已点菜品列表，填充 orderFood 禁用标记
    this.initOrderedFood()
  },
  initOrderedFood(){
    let _this = this
    this.request('/order/select', {
      "account": wx.getStorageSync('userInfo').account,
      "groupCode": wx.getStorageSync('currentVisitGroup').groupCode,
    }, 'GET', (res) => {
      let list = res.data.data || []
      let map = {}
      for(let i in list){
        let item = list[i]
        if(item.cookCode){
          map[item.cookCode] = true
        }
      }
      _this.setData({
        orderFood: map
      })
    }, (fail) => {
      console.log(this.data.LOG_PREFIX, 'initOrderedFood fail', fail)
    })
  },
  onShow(){
    this.initFoodCarCount()
  },
  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      menus:[],
      page:1,
      pageSize: 10,
      orderCount:0
    })
    this.selectCookOverview(false)
    this.initFoodCarCount()
  }
})