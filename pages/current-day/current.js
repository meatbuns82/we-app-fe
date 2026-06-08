const app = getApp()
Page({
  data:{
      loveMenus:[],
      stirFryMenus:[],
      hotpotGroupedMenus:[],
      hotpotCount:0,
      orderMenus:[
      ],
      LOG_PREFIX: "current_day "
  },
  onLoad(){
    let _this = this
    _this.loadOrderMenus()
  },

  infinityScrollDown(){
    _this.setData({
      page: this.data.page + 1
    })
  },

  loadOrderMenus(){
    let _this = this

    app.request(
      '/order/select/current-day',
      {
        "account":wx.getStorageSync('userInfo').account,
        "groupCode": wx.getStorageSync('currentVisitGroup').groupCode,
      },
      'GET',
      (res) => {
        console.log(this.data.LOG_PREFIX, "current day success...", res)
        let list = res.data.data || []
        // 处理图片路径
        for (let i in list) {
          list[i].picturePath = app.visitFile(list[i].picturePath)
        }
        // 按 type 拆分：type=0 炒菜，type=1 火锅；火锅按 foodKind 分组
        let stirFryMenus = []
        let hotpotMap = {}
        for (let i in list) {
          let item = list[i]
          let type = parseInt(item.type)
          if (type === 1) {
            // 火锅，按食材分类
            let kindName = ''
            if (typeof item.foodKind === 'object' && item.foodKind !== null) {
              kindName = item.foodKind.foodName || '其他'
            } else if (typeof item.foodKind === 'string' && item.foodKind) {
              kindName = item.foodKind
            } else {
              kindName = '其他'
            }
            if (!hotpotMap[kindName]) {
              hotpotMap[kindName] = []
            }
            hotpotMap[kindName].push(item)
          } else {
            // 炒菜
            stirFryMenus.push(item)
          }
        }
        // 转换 hotpotMap 为有序数组
        let hotpotGroupedMenus = []
        let hotpotCount = 0
        for (let kind in hotpotMap) {
          hotpotGroupedMenus.push({ kindName: kind, items: hotpotMap[kind] })
          hotpotCount += hotpotMap[kind].length
        }
        _this.setData({
          stirFryMenus: stirFryMenus,
          hotpotGroupedMenus: hotpotGroupedMenus,
          hotpotCount: hotpotCount,
          loveMenus: list
        })
      },
      (res) => {
        console.log(this.data.LOG_PREFIX, "current day  fail...", res)
      }
    )
  },
})