// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    foodMaterials: [
      {"name":"一", "value":"二"},
      {"name":"一", "value":"二"},
      {"name":"一", "value":"二"},
      {"name":"一", "value":"二"},
      {"name":"一", "value":"二"},
    ],
    cookCode:"",
    cookDetail:"",
    LOG_PREFIX: "food_detail "
  },

  selectCookDetail(){
    app.request(
      "/cook/detail",
      {
        "cookCode": this.data.cookCode
      },
      "GET",
       (success) => {
          let cookDetail = success.data.data
          let prefixUrl = app.globalData.api + "/picture/visit?filePath="
          cookDetail.mainImgPath = prefixUrl + encodeURIComponent(cookDetail.mainImgPath)
          this.processStepImgPath(cookDetail.step)
          this.setData({
            cookDetail: success.data.data
          })
      },
      (fail) => {
        console.log(this.data.LOG_PREFIX, "fail", fail)
      }
    )
  },
  processStepImgPath(steps){
      console.log(steps)
      for(let ind in steps){
        let step = steps[ind]
        let prefixUrl = app.globalData.vistPictureApi
        step.imgPath = prefixUrl + encodeURIComponent(step.imgPath)
      }
  },
  onLoad(options) {
    if(options){
      console.log(this.data.LOG_PREFIX, options.cookCode)
      this.setData({
        cookCode: options.cookCode
      })
      this.selectCookDetail()
    }
  }
})
