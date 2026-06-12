const app = getApp()

Page({
  data: {
    // 群组列表
    groups: [],
    currentGroupCode: '',
    currentGroup: null,
    showGroupDrawer: false,

    // 加入群组
    showJoinInput: false,
    joinGroupCode: '',

    // 聊天消息
    messages: [],
    inputText: '',
    scrollToId: '',
    hasMoreMessages: false,
    messagePage: 1,

    // 用户信息
    myAccount: '',

    // 群组操作弹窗
    groupActionSheet: false,
    actionGroup: null,

    // Toast
    toast: { show: false, icon: '', text: '' },

    LOG_PREFIX: 'group: ',

    // 本地消息计数器
    _msgSeq: 0
  },

  // ===== 头像颜色调色板 =====
  _avatarColors: [
    '#C97060', '#A5B8A5', '#E8B84B', '#8BA4C7',
    '#D4A0A0', '#7FA8A0', '#C090A0', '#B8A070'
  ],

  getLetter(name) {
    if (!name) return 'G'
    const trimmed = name.trim()
    // 尝试取第一个非空字符
    return trimmed.charAt(0) || 'G'
  },

  getColor(name) {
    if (!name) return this._avatarColors[0]
    // 根据名字 hash 选色
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % this._avatarColors.length
    return this._avatarColors[index]
  },

  // 为群组列表补充头像 letter 和 color（WXML 不能调用函数）
  _enrichGroups(groups) {
    if (!groups || !groups.length) return []
    return groups.map(g => ({
      ...g,
      avatarLetter: this.getLetter(g.groupName),
      avatarColor: this.getColor(g.groupName),
      memberCount: g.memberCount || g.memberNum || g.userCount || 1
    }))
  },

  // ===== 生命周期 =====
  onLoad() {
    console.log(this.data.LOG_PREFIX, 'group page loaded')
    const userInfo = wx.getStorageSync('userInfo') || {}
    const currentVisitGroup = wx.getStorageSync('currentVisitGroup')
    const groups = this._enrichGroups(userInfo.groupResponse || [])

    this.setData({
      myAccount: userInfo.account || '',
      groups,
      currentGroupCode: (currentVisitGroup || {}).groupCode || '',
    })

    // 自动选中当前群组
    if (groups.length > 0) {
      const current = currentVisitGroup && currentVisitGroup.groupCode
        ? groups.find(g => g.groupCode === currentVisitGroup.groupCode)
        : groups[0]
      if (current) {
        this.setData({
          currentGroup: current,
          currentGroupCode: current.groupCode
        })
        this.loadMessages()
      }
    }
  },

  onShow() {
    // 回到页面时刷新群组列表
    const userInfo = wx.getStorageSync('userInfo') || {}
    const groups = this._enrichGroups(userInfo.groupResponse || [])
    this.setData({ groups })

    // 如果当前群组不在列表中，重置
    if (this.data.currentGroupCode) {
      const found = groups.find(g => g.groupCode === this.data.currentGroupCode)
      if (!found) {
        const firstGroup = groups.length > 0 ? groups[0] : null
        this.setData({
          currentGroup: firstGroup,
          currentGroupCode: firstGroup ? firstGroup.groupCode : '',
          messages: []
        })
        if (firstGroup) this.loadMessages()
      }
    }
  },

  // ===== 群组抽屉 =====
  toggleGroupDrawer() {
    this.setData({
      showGroupDrawer: !this.data.showGroupDrawer
    })
  },

  closeGroupDrawer() {
    this.setData({
      showGroupDrawer: false,
      showJoinInput: false,
      joinGroupCode: ''
    })
  },

  // ===== 群组切换 =====
  switchGroup(e) {
    const group = e.currentTarget.dataset.group
    if (!group || group.groupCode === this.data.currentGroupCode) return

    this.setData({
      currentGroup: group,
      currentGroupCode: group.groupCode,
      messages: [],
      messagePage: 1,
      hasMoreMessages: false
    })

    wx.setStorageSync('currentVisitGroup', group)
    this.loadMessages()
    this.closeGroupDrawer()
  },

  // ===== 加入群组 =====
  showJoinGroup() {
    this.setData({
      showJoinInput: !this.data.showJoinInput,
      joinGroupCode: ''
    })
  },

  onJoinCodeInput(e) {
    this.setData({ joinGroupCode: e.detail.value })
  },

  joinGroup() {
    const code = this.data.joinGroupCode.trim()
    if (!code) {
      this.showToast('⚠️', '请输入群组码')
      return
    }

    const _this = this
    wx.showLoading({ title: '加入中...' })

    app.request(
      '/group/join',
      {
        account: this.data.myAccount,
        groupCode: code
      },
      'POST',
      (res) => {
        wx.hideLoading()
        if (res.data && res.data.success) {
          _this.showToast('✅', '加入成功')
          _this.setData({
            showJoinInput: false,
            joinGroupCode: ''
          })
          // 刷新群组列表
          _this.refreshUserInfo()
        } else {
          _this.showToast('❌', res.data.message || '加入失败，请检查群组码')
        }
      },
      (fail) => {
        wx.hideLoading()
        console.log(_this.data.LOG_PREFIX, 'joinGroup fail', fail)

        // 本地模拟加入成功（开发阶段）
        _this.mockJoinGroup(code)
      }
    )
  },

  // 开发阶段：本地模拟加入群组
  mockJoinGroup(code) {
    const newGroup = {
      groupCode: code,
      groupName: '群组 ' + code.slice(-4),
      defaultGroup: false,
      memberCount: 2
    }

    // 检查是否已存在
    const exists = this.data.groups.find(g => g.groupCode === code)
    if (exists) {
      this.showToast('⚠️', '已经在该群组中啦')
      this.setData({
        showJoinInput: false,
        joinGroupCode: ''
      })
      return
    }

    const groups = this._enrichGroups([...this.data.groups, newGroup])
    this.setData({
      groups,
      showJoinInput: false,
      joinGroupCode: ''
    })
    this.showToast('✅', '加入成功（模拟）')

    // 同步到本地存储
    this.syncGroupsToStorage(groups)
  },

  // ===== 退出群组 =====
  leaveGroup() {
    const group = this.data.actionGroup
    if (!group) return

    const _this = this
    wx.showModal({
      title: '退出群组',
      content: `确定要退出「${group.groupName}」吗？`,
      success(res) {
        if (res.confirm) {
          wx.showLoading({ title: '退出中...' })

          app.request(
            '/group/leave',
            {
              account: _this.data.myAccount,
              groupCode: group.groupCode
            },
            'DELETE',
            (res) => {
              wx.hideLoading()
              _this.closeGroupActions()
              if (res.data && res.data.success) {
                _this.removeGroupFromList(group)
                _this.showToast('✅', '已退出群组')
              } else {
                _this.showToast('❌', res.data.message || '操作失败')
              }
            },
            (fail) => {
              wx.hideLoading()
              console.log(_this.data.LOG_PREFIX, 'leaveGroup fail', fail)
              // 本地模拟
              _this.removeGroupFromList(group)
              _this.showToast('✅', '已退出群组（模拟）')
              _this.closeGroupActions()
            }
          )
        }
      }
    })
  },

  removeGroupFromList(group) {
    const groups = this._enrichGroups(
      this.data.groups.filter(g => g.groupCode !== group.groupCode)
    )
    let currentGroup = this.data.currentGroup
    let currentGroupCode = this.data.currentGroupCode
    let messages = this.data.messages

    if (group.groupCode === currentGroupCode) {
      currentGroup = groups.length > 0 ? groups[0] : null
      currentGroupCode = currentGroup ? currentGroup.groupCode : ''
      messages = []
      if (currentGroup) {
        this.loadMessages()
      }
    }

    this.setData({
      groups,
      currentGroup,
      currentGroupCode,
      messages
    })
    this.syncGroupsToStorage(groups)
  },

  // ===== 置顶/取消置顶 =====
  pinGroup() {
    const group = this.data.actionGroup
    if (!group) return

    // 取消所有群的置顶，再置顶选中的群
    let groups = this.data.groups.map(g => ({
      ...g,
      defaultGroup: g.groupCode === group.groupCode
    }))
    groups = this._enrichGroups(groups)

    this.setData({ groups, groupActionSheet: false, actionGroup: null })
    this.showToast('📌', '已置顶')
    this.syncGroupsToStorage(groups)
  },

  unpinGroup() {
    const group = this.data.actionGroup
    if (!group) return

    let groups = this.data.groups.map(g => ({
      ...g,
      defaultGroup: g.groupCode === group.groupCode ? false : g.defaultGroup
    }))
    groups = this._enrichGroups(groups)

    this.setData({ groups, groupActionSheet: false, actionGroup: null })
    this.showToast('📍', '已取消置顶')
    this.syncGroupsToStorage(groups)
  },

  // ===== 群组操作弹出菜单 =====
  showGroupActions(e) {
    const group = e.currentTarget.dataset.group
    this.setData({
      groupActionSheet: true,
      actionGroup: group
    })
  },

  closeGroupActions() {
    this.setData({
      groupActionSheet: false,
      actionGroup: null
    })
  },

  showGroupInfo() {
    const name = (this.data.currentGroup || {}).groupName || '群聊'
    const count = (this.data.currentGroup || {}).memberCount || '...'
    this.showToast('ℹ️', name + ' · ' + count + ' 位成员')
  },

  // ===== 聊天消息 =====
  loadMessages() {
    const _this = this
    const groupCode = this.data.currentGroupCode
    if (!groupCode) return

    // 这里调用后端获取消息
    // 开发阶段使用模拟数据
    _this.mockLoadMessages()
  },

  mockLoadMessages() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    const now = Date.now()
    const nickName = userInfo.nickName || '我'

    const mockMessages = [
      {
        msgId: 'mock_1',
        content: '今天大家想吃什么呀？',
        senderName: '小明',
        isSelf: false,
        timeLabel: '10:30',
        timestamp: now - 3600000 * 3
      },
      {
        msgId: 'mock_2',
        content: '我想吃鱼香肉丝和番茄炒蛋！',
        senderName: nickName,
        isSelf: true,
        timeLabel: '10:32',
        timestamp: now - 3600000 * 2.9
      },
      {
        msgId: 'mock_3',
        content: '好啊好啊，再加个汤吧 🍲',
        senderName: '小红',
        isSelf: false,
        timeLabel: '10:35',
        timestamp: now - 3600000 * 2.8
      },
      {
        msgId: 'mock_4',
        content: '紫菜蛋花汤怎么样？',
        senderName: '小明',
        isSelf: false,
        timeLabel: '10:36',
        timestamp: now - 3600000 * 2.7
      },
      {
        msgId: 'mock_5',
        content: '可以可以，那我下单啦 👌',
        senderName: nickName,
        isSelf: true,
        timeLabel: '10:38',
        timestamp: now - 3600000 * 2.5
      }
    ]

    // 补充头像信息
    const enriched = mockMessages.map(msg => ({
      ...msg,
      avatarLetter: this.getLetter(msg.senderName),
      avatarColor: this.getColor(msg.senderName)
    }))

    // 添加时间分隔
    const messages = this.formatMessages(enriched)
    this.setData({
      messages,
      hasMoreMessages: false
    })

    // 滚动到底部
    setTimeout(() => {
      this.scrollToBottom()
    }, 100)
  },

  formatMessages(msgs) {
    let lastDateStr = ''
    return msgs.map(msg => {
      const d = new Date(msg.timestamp)
      const h = String(d.getHours()).padStart(2, '0')
      const m = String(d.getMinutes()).padStart(2, '0')
      const timeStr = `${h}:${m}`

      const dateStr = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
      const showTime = dateStr !== lastDateStr
      lastDateStr = dateStr

      return {
        ...msg,
        timeLabel: msg.timeLabel || timeStr,
        timeStr: dateStr,
        showTime
      }
    })
  },

  loadMoreMessages() {
    this.showToast('📜', '没有更多消息了')
  },

  // ===== 发送消息 =====
  onInputText(e) {
    this.setData({ inputText: e.detail.value })
  },

  sendMessage() {
    const content = this.data.inputText.trim()
    if (!content) return

    const userInfo = wx.getStorageSync('userInfo') || {}
    const nickName = userInfo.nickName || '我'
    const seq = this.data._msgSeq + 1

    const newMsg = {
      msgId: 'local_' + Date.now() + '_' + seq,
      content,
      senderName: nickName,
      isSelf: true,
      timeLabel: this.getCurrentTime(),
      timestamp: Date.now(),
      showTime: false,
      avatarLetter: this.getLetter(nickName),
      avatarColor: this.getColor(nickName)
    }

    const messages = [...this.data.messages, newMsg]
    this.setData({
      messages,
      inputText: '',
      _msgSeq: seq
    })

    // 滚动到底部
    setTimeout(() => {
      this.scrollToBottom()
    }, 50)

    // 发送到后端
    this.sendMessageToServer(content)
  },

  sendMessageToServer(content) {
    app.request(
      '/group/chat/send',
      {
        account: this.data.myAccount,
        groupCode: this.data.currentGroupCode,
        content: content
      },
      'POST',
      (res) => {
        console.log(this.data.LOG_PREFIX, 'send success', res)
      },
      (fail) => {
        console.log(this.data.LOG_PREFIX, 'send fail (offline mode)', fail)
      }
    )
  },

  scrollToBottom() {
    const msgs = this.data.messages
    if (msgs.length > 0) {
      const lastId = msgs[msgs.length - 1].msgId
      this.setData({
        scrollToId: 'msg-' + lastId
      })
    }
  },

  getCurrentTime() {
    const d = new Date()
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
  },

  // ===== 工具方法 =====

  syncGroupsToStorage(groups) {
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.groupResponse = groups
    wx.setStorageSync('userInfo', userInfo)
  },

  refreshUserInfo() {
    const _this = this
    app.login((res) => {
      if (res.data && res.data.data) {
        const userInfo = res.data.data
        wx.setStorageSync('userInfo', userInfo)
        _this.setData({
          groups: _this._enrichGroups(userInfo.groupResponse || [])
        })
      }
    }, (fail) => {
      console.log(_this.data.LOG_PREFIX, 'refreshUserInfo fail', fail)
      const userInfo = wx.getStorageSync('userInfo') || {}
      _this.setData({
        groups: _this._enrichGroups(userInfo.groupResponse || [])
      })
    })
  },

  showToast(icon, text) {
    this.setData({
      toast: { show: true, icon, text }
    })
    setTimeout(() => {
      this.setData({
        toast: { show: false, icon: '', text: '' }
      })
    }, 2000)
  },

  preventTouchMove() {},

  stopPropagation(e) {
    e.stopPropagation && e.stopPropagation()
  }
})
