// pages/self_pages/self_pages.js
let app = getApp()
let leancloud_storage = require("../../utils/get_data.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // header_icon: null,
    // header_name: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.setNavigationBarTitle({
      title: '我的'
    })
    // that.setData({
    //   header_icon: app.globalData.userInfo.attributes.avatarUrl,
    //   header_name: app.globalData.userInfo.attributes.nickName
    // })
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
  onShareAppMessage: function() {

  }
})