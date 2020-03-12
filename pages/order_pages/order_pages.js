// pages/open_pages/order_pages.js
let leancloud_storage = require("../../utils/get_data.js")
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_data: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    info_flg: app.globalData.power_flg
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '订单'
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
    let that = this;
    leancloud_storage.business_data.find().then(
      function(todos) {
        that.setData({
          order_data: todos
        })
        console.log(that.data.order_data)
        console.log(that.data.info_flg)
        console.log(app.globalData.power_flg)
      })
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
  onShareAppMessage: function() {

  }
})