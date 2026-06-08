// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    page:1,
    pageSize:10,
    foodKind:[],
    orderCount:0,
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
    // 数量最小为0
    // 这个food如果不在菜单里，不应该执行扣减操作
      this.setData({
        orderCount:this.data.orderCount - 1
      })
      this.request('/order/deOrder?cookCode=' + food.foodCode +
       "&account=" + wx.getStorageSync('userInfo').account +
        "&groupCode=" + wx.getStorageSync('currentVisitGroup').groupCode, null, 'DELETE',  (res) => {
          this.setData({
            foodKinds: res.data.data,
            pcikerBindFoodKind:null,
          })
      }, (res) => {
        console.log(this.data.LOG_PREFIX, res)
      })
  },
  orderFood(e){
    let food = e.currentTarget.dataset.param
    app.request('/order/increaseOrder', {
      "cookCode":food.foodCode,
      "account":wx.getStorageSync('userInfo').account,
      "groupCode": wx.getStorageSync('currentVisitGroup').groupCode,
      "type":1
      }, 'POST',  (res) => {
        console.log(this.data.LOG_PREFIX, res)
        if(res.data.status){
          wx.showModal({
            title: '小tip',
            content: '这道菜已经点过啦ლ(╹◡╹ლ)',
            complete: (res) => {
              if (res.cancel) {
              }
              if (res.confirm) {
              }
            }
          })
        }else{
        this.setData({
            foodKinds: res.data.data,
            pcikerBindFoodKind:null,
            orderCount:this.data.orderCount + 1
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
  },
  onLoad(options) {
    this.initFoodCarCount()
    this.selectFoodKind()
  }
})
