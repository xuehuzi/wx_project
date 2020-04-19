//index.js
//获取应用实例
let app = getApp()
let leancloud_storage = require("../../utils/get_data.js")
let md5 = require("../../utils/md5.js")

Page({
  data: {
    business_data: [], //商户数据
    user_info: {}, //用户数据
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    info_flg: app.globalData.power_flg,
    address: '点击获得您的地理位置',
    sk: 'EP1AKG9zSy9U8hAufBJ87YS3AIEx9pnd',
    name_sk: 'AJIBZ-SMPL3-MFA3U-YOI5L-FAONQ-OIBE6',
    reach_bottom: true,
    loading_text: '...',
  },

  onLoad: function() {
    let that = this
    let user = leancloud_storage.AV.User.current()
    wx.getSetting({ //授权检查
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log('已经授权')
        } else {
          wx.hideTabBar()
          app.globalData.power_flg = true
          that.setData({
            info_flg: true
          })
          console.log('还没授权')
        }
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            type: 'gcj02',
            success(res) {
              // 获取经纬度（latitude，longitude）
              that.get_address(res.latitude, res.longitude)
              // get_address解析具体地址
              that.setData({
                location_flg: false
              })
            }
          })
        } else {
          that.setData({
            location_flg: true,
          })
        }
      }
    })

    leancloud_storage.AV.User.loginWithWeapp().then( //leancloud一键登录接口获取session_key和openid
      user => {
        wx.getUserInfo({
          success: function(res) {
            app.globalData.userInfo = user
            user.set(res.userInfo).save()
            //console.log(app.globalData.userInfo)
            //console.log(res.userInfo)
          }
        })
      }
    )
  },

  onReady: function() { //拉取商户数据
    let that = this
    wx.showLoading({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    leancloud_storage.business_data.limit(5)
    leancloud_storage.business_data.find().then(
      function(todos) {
        that.setData({
          business_data: todos
        })
      }).then(
      () => {
        wx.hideLoading()
      }
    ).catch(
      () => {
        wx.showToast({
          title: '拉取数据失败，请检查网络或关闭小程序再进',
          icon: 'none',
          duration: 5000
        })
      }
    )
  },

  getUserInfo: function(e) { //点击头像昵称授权
    if (e.detail.userInfo) {
      wx.showTabBar({})
      app.globalData.power_flg = false
      this.setData({
        info_flg: false
      })
    } else {
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

  get_position: function() {
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation'] === undefined) {
          //第一次唤起位置授权（非授权拒绝，从没点过授权）
          wx.getLocation({
            type: 'gcj02',
            success(res) {
              that.get_address(res.latitude, res.longitude)
            },
            fail() {
              wx.showToast({
                title: '你拒绝了位置授权,部分功能将不能使用',
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (res.authSetting['scope.userLocation']) {
          //已经授权，点击更新地址
          wx.showModal({
            title: '更新位置信息',
            content: '点击确定即可更新位置信息',
            success(res) {
              if (res.confirm) {
                wx.getLocation({
                  type: 'gcj02',
                  success(res) {
                    that.get_address(res.latitude, res.longitude)
                  }
                })
              }
            }
          })
        } else {
          //授权后取消了，唤起的设置界面
          wx.openSetting({
            success(res) {
              if (res.authSetting['scope.userLocation']) {
                wx.showToast({
                  title: '授权成功！',
                })
              } else {
                wx.showToast({
                  title: '授权失败！',
                })
              }
            }
          })
        }
      }
    })
  },

  go_details: function(e) { //点击商户
    let index = e.currentTarget.dataset.index;
    let str = JSON.stringify(this.data.business_data[index])
    wx.navigateTo({
      url: '../open_pages/open_pages?str=' + str,
      success: function(res) {
        //console.log('跳转OK')
      }
    })
  },

  get_address(lat, lon) { //位置经纬度解析
    let that = this
    let SIG = md5("/ws/geocoder/v1?key=" + that.data.name_sk + "&location=" + String(lat) + "," + String(lon) + that.data.sk)
    //md5解密数据
    wx.request({ //请求地址转换后信息
      url: "https://apis.map.qq.com/ws/geocoder/v1",
      data: {
        key: that.data.name_sk,
        location: `${lat},${lon}`,
        sig: SIG
      },
      success(res) {
        that.setData({
          address: res.data.result.address
        })
      },
      fail(e) {
        console.log('位置获取失败')
      }
    })
  },
  onPullDownRefresh: function() { //下拉刷新
    let that = this
    console.log('下拉刷新')
    leancloud_storage.business_data.find().then(
      function(todos) {
        that.setData({
          business_data: todos
        })
      }).then(
      () => {
        console.log('刷新完成')
      }
    ).catch(
      () => {
        wx.showToast({
          title: '拉取数据失败，请检查网络或下拉刷新尝试',
          icon: 'none',
          duration: 5000
        })
      }
    )
  },
  onReachBottom: function() {
    let that = this
    let data_length = 0
    that.setData({
      reach_bottom: false,
    })
    leancloud_storage.business_data.limit(that.data.business_data.length + 1) //设置返回结果数量
    leancloud_storage.business_data.count().then(function(count) { //获取data长度
        data_length = count
      })
      .then(
        () => {
          if (that.data.business_data.length < data_length) { //判断是否已经将data加载完
            that.setData({
              loading_text: '加载更多',
            })
            leancloud_storage.business_data.find()
              .then(
                (todos) => {
                  that.setData({
                    business_data: todos,
                  })
                })
          } else {
            that.setData({
              loading_text: '没有了',
            })
          }
        }
      )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '自定义转发标题button',
      path: '/pages/index/index',
      imageUrl: '../self_pages/img/share.jpg'
    }
  },

  onShow() {
    let that = this
    wx.getSetting({ //检测位置授权状态
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          wx.getLocation({
            type: 'gcj02',
            success(res) {
              that.get_address(res.latitude, res.longitude)
            }
          })
        } else {
          that.setData({
            address: '点击获得您的地理位置'
          })
        }
      }
    })
  }
})