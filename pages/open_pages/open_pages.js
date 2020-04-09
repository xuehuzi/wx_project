// pages/open_pages.js
let util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    get_data: null,
    select_tab: 0,
    swiper_height: null,
    top_height: null,
    bottom_height: null,
    screen_height: null,
    price: 0,
  },

  onLoad: function(options) {
    let that = this
    let str = JSON.parse(options.str)
    wx.setNavigationBarTitle({
      title: '店铺详情'
    })
    str.goods.forEach((item) => {
      item.select_amount = 0
      that.setData({
        get_data: str
      })
    })
  },

  swiper_tab: function(e) { //滑动切换
    this.setData({
      select_tab: e.detail.current
    })
  },

  click_tab: function(e) { //点击切换
    if (this.data.select_tab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        select_tab: e.target.dataset.current
      })
    }
  },

  add_amount: function(e) {
    let index = e.target.dataset.index
    let key = 'get_data.goods[' + index + '].select_amount'
    let test = 0
    if (this.data.get_data.goods[index].select_amount < this.data.get_data.goods[index].numb) {
      this.setData({
        [key]: this.data.get_data.goods[index].select_amount + 1,
        price: this.data.price + Number(this.data.get_data.goods[index].price)
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '库存不足',
        showCancel: false,
      })
    }
  },

  less_amount: function(e) {
    let index = e.target.dataset.index
    let key = 'get_data.goods[' + index + '].select_amount'
    this.setData({
      [key]: this.data.get_data.goods[index].select_amount - 1,
      price: this.data.price - Number(this.data.get_data.goods[index].price)
    })
  },

  onReady: function() { //生命周期函数--监听页面初次渲染完成

  },

  onShow: function() { //生命周期函数--监听页面显示
    let that = this
    that.setData({
      screen_height: wx.getSystemInfoSync().windowHeight
    })

    wx.createSelectorQuery().select('.openpage_header').boundingClientRect().exec(function(res) {
      that.setData({
        top_height: res[0].height
      })
    })

    wx.createSelectorQuery().select('.openpage_footer').boundingClientRect().exec(function(res) {
      that.setData({
        bottom_height: res[0].height + 10 //10是底栏图标凸出的距离
      })
    })
  },

  shopping_submit: function() {
    //店铺名
    //商品名、商品价格、商品图标、商品数量
    //总价
    //收货地址（无默认地址情况处理）
    //下单时间
    //用户id
    let order_obj = {}
    order_obj.time  = util.formatTime(new Date())
    order_obj.orders = []
    order_obj.name = this.data.get_data.name
    order_obj.price = this.data.price
    order_obj.icon = this.data.get_data.icon
    if (this.data.price > 0) {
      this.data.get_data.goods.forEach((item) => { //处理已经添加的商品
        if (item.select_amount > 0) {
          order_obj.orders.push(item)
        }
      })
      console.log(order_obj)
      order_obj = JSON.stringify(order_obj)
      
      wx.navigateTo({
        url: '../open_pages/confirm_order/confirm_order?order_obj=' + order_obj,
      })
    } else {
      wx.showToast({
        title: '不够配送金额',
        icon: 'none',
        duration: 2000
      })
    }
  },

  onHide: function() { //生命周期函数--监听页面隐藏

  },

  onUnload: function() { //生命周期函数--监听页面卸载

  },

  onPullDownRefresh: function() { //事件-监听用户下拉动作

  },

  onReachBottom: function() { //事件-页面上拉触底事件的处理函数

  },

})