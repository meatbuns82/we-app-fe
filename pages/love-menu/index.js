const app = getApp()
Page({
  data:{
      loveMenus:[],
      page: 1,
      LOG_PREFIX: "love_menu "
  },
  onLoad(){
    let _this = this
    _this.loadLoveMenus()
  },

  infinityScrollDown(){
    this.setData({
      page: this.data.page + 1
    })
  },

  loadLoveMenus(){
    let _this = this

    app.request(
      "/cook/collect/",
      {
        "account": wx.getStorageSync('userInfo').account,
        "page": this.data.page,
        "size": 10
      },
      "GET",
      (res) => {
        console.log("collect list success...", res)
        let loveMenus = res.data.data.records
        for(let index in loveMenus) {
          let menu = loveMenus[index]
          // let prefixUrl = app.globalData.api + "/picture/visit?filePath="
          menu.picturePath = app.visitFile(menu.picturePath)
      }
        _this.setData({
          loveMenus: loveMenus
        })
        console.log(this.data.LOG_PREFIX, _this.data.loveMenus)
      },
      (res) => {
        console.log(this.data.LOG_PREFIX, "collect list  fail...", res)
      }
    )
  },
  alterLoveStatus(e){
    console.log(e)
    let data = e.currentTarget.dataset.value1
     app.request(
        '/cook/collect/',
        {
          "account": data.account,
          "cookCode": data.cookCode,
          "collect": false
        },
        'POST',
        (res) => {
          console.log(this.data.LOG_PREFIX, "success...", res)
        },
        (res) => {
          console.log(this.data.LOG_PREFIX, "fail...", res)
        }
      )
  },

  toDayWant(e){
      console.log(this.data.LOG_PREFIX, "todata want", e.currentTarget.dataset.menu)
      // app.request(
      //   '',
      //   '',
      //   'POST',
      //   (res) => {
      //     console.log("success...", res)
      //   },
      //   (res) => {
      //     console.log("fail...", res)
      //   }
      // )
  }
})