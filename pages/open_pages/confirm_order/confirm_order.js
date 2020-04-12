// pages/open_pages/confirm_order.js
let leancloud_storage = require("../../../utils/get_data.js")
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_obj: null,
    address: null,
    show_address: null,
    order_state: false
  },

  chose_address: function() {
    wx.navigateTo({
      url: '../../self_pages/address/address',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let user = leancloud_storage.AV.User.current()
    let order_obj = JSON.parse(options.order_obj)
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    for (let i = 0; i < user.attributes.address.length; i++) {
      if (user.attributes.address[i].chose) {
        that.setData({
          address: user.attributes.address[i],
          show_address: true
        })
        break
      } else {
        that.setData({
          show_address: false
        })
      }
    }
    that.setData({
      order_obj: order_obj
    })
  },

  submit_orders: function() {
    let that = this
    if (!that.data.show_address) { //是否选了配送地址
      wx.showToast({
        title: '请选择一个配送地址',
        icon: 'none',
        duration: 2000
      })
    } else {
      let user = leancloud_storage.AV.User.current()
      let todos = null
      let index = null
      leancloud_storage.order_data.find().then(
        function(val) {
          for (let i = 0; i < val.length; i++) {
            if (val[i].attributes.order_obj.id === user.id) { //是否已有订单记录，有则push无则新增
              todos = val
              index = i
            }
          }
        }).then(
        () => {
          if (todos !== null) {
            let todo = leancloud_storage.AV.Object.createWithoutData('order_data', todos[index].id);
            let temp_order_obj = todos[index].attributes.order_obj
            temp_order_obj.lists.push(that.data.order_obj)
            todo.set('order_obj', temp_order_obj);
            todo.save();
          } else {
            let order_obj = {}
            let order_data = leancloud_storage.AV.Object.extend("order_data");
            let OrderData = new order_data()
            order_obj.id = user.id
            order_obj.lists = []
            order_obj.lists.push(that.data.order_obj)
            OrderData.save({
              order_obj: order_obj
            })
          }
        }
      ).then(
        () => {
          that.setData({
            order_state: true
          })
          app.globalData.order_state = true
          wx.showToast({
            title: '订单提交成功',
            icon: 'none',
            duration: 2000
          })
        }
      )
    }
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
    let that = this
    let user = leancloud_storage.AV.User.current()
    for (let i = 0; i < user.attributes.address.length; i++) {
      if (user.attributes.address[i].chose) {
        that.setData({
          show_address: true,
          address: user.attributes.address[i],
        })
        break
      } else {
        that.setData({
          show_address: false
        })
      }
    }
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