// pages/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    innerText: {
      type: String,
      value: 'default value',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo: function(e) {
      if (e.detail.userInfo) {
        //允许授权
        //wx.showTabBar({})
        this.setData({
          info_flg: false
        })
      } else {
        //拒绝授权
        wx.showModal({
          title: '警告',
          content: '您拒绝了授权，将无法进入小程序，请授权之后再使用',
          showCancel: false,
          confirmText: '返回授权',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
    },
  }
})