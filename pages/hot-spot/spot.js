// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    page:1,
    pageSize:10,
    foodKind:[],
    orderCount:0,
    orderFood:{},
    loading:false,
    LOG_PREFIX: "hot_spot "
  },
  foodCar(){
    wx.navigateTo({
      url: '../foodCar/car'
    })
  },
  showMore(){
    if (this.data.loading) return
    this.setData({
      page: this.data.page + 1,
      loading: true
    })
    this.selectFoodKind()
  },
  deOrderFood(e){
    let food = e.currentTarget.dataset.param
    let key = food.foodCode
    let map = this.data.orderFood
    this.setData({
      orderCount: Math.max(0, this.data.orderCount - 1)
    })
    this.request('/order/deOrder?cookCode=' + food.foodCode +
       "&account=" + wx.getStorageSync('userInfo').account +
        "&groupCode=" + wx.getStorageSync('currentVisitGroup').groupCode, null, 'DELETE',  (res) => {
          delete map[key]
          this.setData({
            foodKinds: res.data.data,
            pcikerBindFoodKind:null,
            orderFood: map
          })
      }, (res) => {
        console.log(this.data.LOG_PREFIX, res)
      })
  },
  orderFood(e){
    let food = e.currentTarget.dataset.param
    let key = food.foodCode
    let map = this.data.orderFood
    // 已点过，不再重复请求
    if(map[key]){
      return
    }
    app.request('/order/increaseOrder', {
      "cookCode":food.foodCode,
      "account":wx.getStorageSync('userInfo').account,
      "groupCode": wx.getStorageSync('currentVisitGroup').groupCode,
      "type":1
      }, 'POST',  (res) => {
        console.log(this.data.LOG_PREFIX, res)
        if(res.data.status){
          // 后端返回已点过，本地标记禁用
          map[key] = true
          this.setData({ orderFood: map })
          wx.showModal({
            title: '小tip',
            content: '这道菜已经点过啦ლ(╹◡╹ლ)',
          })
        }else{
          // 点单成功，标记已点
          map[key] = true
          this.setData({
            foodKinds: res.data.data,
            pcikerBindFoodKind:null,
            orderCount: this.data.orderCount + 1,
            orderFood: map
          })
        }
    }, (res) => {

    })
  },
  selectFoodKind(){
    let _this = this
      app.request("/food/kind/page", {
          "page":this.data.page,
          "pageSize":this.data.pageSize
      }, "GET", (sRes) => {
        let datas = sRes.data.data
        for (let i in datas){
          let data = datas[i]
          data["imagePath"] = app.visitFile(data["imagePath"])
        }
        let foodKind = _this.data.foodKind.concat(datas)
        _this.setData({
          foodKind: foodKind,
          loading: false
        })
      }, (fRes) => {
        _this.setData({ loading: false })
      })
  },
  initFoodCarCount(){
    app.request('/order/sum', {
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
    app.request('/order/select', {
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
  onLoad(options) {
    this.initFoodCarCount()
    this.selectFoodKind()
  }
})
