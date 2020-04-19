// pages/open_pages/order_pages.js
let leancloud_storage = require("../../utils/get_data.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    get_orders: [],
    show_flg: null,

    select_index: null,

  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '订单'
    })
  },

  click_order_lists: function(e) {
    let index = e.currentTarget.dataset.index
    let key = 'get_orders[' + index + '].hidden'
    this.setData({
      select_index: e.currentTarget.dataset.index,
      [key]: !this.data.get_orders[index].hidden
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
    let user = leancloud_storage.AV.User.current()
    leancloud_storage.order_data.equalTo('order_obj.id', user.id);
    leancloud_storage.order_data.find().then(
      function(todos) {
        if (todos.length > 0) {
          that.setData({
            get_orders: todos[0].attributes.order_obj.lists,
            show_flg: true
          })
          that.data.get_orders.forEach(function(item, index) {
            //item.isset = false
            let key = 'get_orders[' + index + '].hidden'
            that.setData({
              [key]: false
            })
          })
          //console.log(that.data.get_orders)
        } else {
          that.setData({
            show_flg: false
          })
        }
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

  }
})