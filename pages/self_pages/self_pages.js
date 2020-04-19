// pages/self_pages/self_pages.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      return {
        title: '自定义转发标题button',
        path: '/pages/index/index',
        imageUrl: '../self_pages/img/share.jpg'
      }
    } else {
      return {
        title: '自定义转发标题menu',
        path: '/pages/index/index',
        imageUrl: '../self_pages/img/share.jpg'
      }
    }
  },
  save_img: function() { //保存图片
    let that = this
    wx.getSetting({ //授权检查
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum'] === undefined || res.authSetting['scope.writePhotosAlbum']) {
          //有相册访问权,或第一次点击申请相册访问权
          wx.downloadFile({
            url: 'https://lc-URfkqxY5.cn-n1.lcfile.com/dbfd158ed4b6bbb91c17.jpg', //示例
            success: function(res) {
              if (res.statusCode === 200) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(res) {
                    wx.showToast({
                      title: '保存图片成功！',
                    })
                  },
                  fail(res) {
                    wx.showToast({
                      title: '保存图片失败！',
                    })
                  }
                })
              }
            }
          })
        } else {
          //不是第一次申请相册访问权，唤起设置界面
          wx.openSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                wx.showToast({
                  title: '图片授权成功！',
                })
              } else {
                wx.showToast({
                  title: '图片授权失败！',
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.setNavigationBarTitle({
      title: '我的'
    })
  },

  edit_address: function() {
    wx.navigateTo({
      url: '../self_pages/address/address',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
})