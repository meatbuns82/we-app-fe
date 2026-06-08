// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
   orderCookFood:{},
   orderHotSpotFood:{},
   LOG_PREFIX: "food_car "
  },
  deOrderFood(e){
    let food = e.currentTarget.dataset.param
    let _this = this
    app.request('/order/deOrder?cookCode=' + food.cookCode +
      "&account=" + wx.getStorageSync('userInfo').account +
      "&groupCode=" + wx.getStorageSync('currentVisitGroup').groupCode, null, 'DELETE',  (res) => {
        _this.initOrderFoodCar()
    }, (res) => {
      console.log(res)
    })
  },
  checkHealthDiet(){
      // 健康饮食检查，主食是否存在，有没有素食，有没有肉食，有没有水产
  },
  initOrderFoodCar(){
    app.request('/order/select?account=' + wx.getStorageSync('userInfo').account + "&groupCode=" + wx.getStorageSync('currentVisitGroup').groupCode, 'GET', null,
      (sRes) => {
          console.log(sRes)
          let menus = sRes.data.data
          for(let index in menus) {
            let menu = menus[index]
            // let prefixUrl = app.globalData.api + "/picture/visit?filePath="
            menu.picturePath = app.visitFile(menu.picturePath)
        }
        let datas  = sRes.data.data
        let orderCookFood = []
        let orderHotSpotFood = []
        for(let i in datas){
            let data = datas[i]
            if(data["type"] == 0){
              orderCookFood.push(data)
            }else if(data["type"] == 1){
              orderHotSpotFood.push(data)
            }
        }
          this.setData({
            orderCookFood:orderCookFood,
            orderHotSpotFood:orderHotSpotFood
          })
      },
      (fRes) => {
        console.log(this.data.LOG_PREFIX, fRes)
      }
    )
  },
  onLoad(options) {
    this.initOrderFoodCar()
    this.checkHealthDiet()
  }
})
