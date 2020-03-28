// pages/self_pages/address/address.js
let leancloud_storage = require("../../../utils/get_data.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_flg: null,
    modal_hidden: true,
    address_details: '',
    address_name: '',
    address_telephone: '',
    user_address: [],
    //
    region: [],
    edit_modal_hidden: true,
    edit_index: null,
    edit_address_details: '',
    edit_address_name: '',
    edit_address_telephone: '',
    edit_chose: null,
    chose_flg: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { //判断是否已经有地址在服务端
    let that = this
    let user = leancloud_storage.AV.User.current()
    wx.setNavigationBarTitle({
      title: '我的地址'
    })
    if (user.attributes.address === undefined) {
      user.set('address', [])
      user.save().then(
        () => {
          that.setData({
            address_flg: false
          })
        }
      )
    } else if (user.attributes.address.length === 0) {
      that.setData({
        address_flg: false
      })
    } else {
      that.setData({
        address_flg: true,
        user_address: user.attributes.address
      })
    }
  },

  add_address: function() { //点击新增地址
    let user = leancloud_storage.AV.User.current()
    if (user.attributes.address.length >= 6) {
      wx.showToast({
        title: '地址最多存6个',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        modal_hidden: false,
        address_details: '',
        address_name: '',
        address_telephone: '',
        chose_flg: false,
        region: []
      })
    }
  },

  add_wx_address: function() { //微信授权地址
    let that = this
    let temp_address = [] //临时保存当前添加的地址
    let _uesr_address = {} //临时保存当前添加的地址
    let user = leancloud_storage.AV.User.current()
    if (user.attributes.address.length >= 6) {
      wx.showToast({
        title: '地址最多存6个',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.chooseAddress({
        success(res) {
          _uesr_address.province_city = res.provinceName + res.cityName + res.countyName
          _uesr_address.address_details = res.detailInfo
          _uesr_address.address_name = res.userName
          _uesr_address.address_telephone = res.telNumber
          temp_address.push(_uesr_address)
          that.setData({
            address_flg: true,
            modal_hidden: true,
            user_address: that.data.user_address.concat(temp_address),
          })
          user.set('address', that.data.user_address)
          user.save()
        }
      })
    }
  },

  confirm_modal: function(e) { //模态确定
    let temp_address = [] //临时保存当前添加的地址
    let _uesr_address = {} //临时保存当前添加的地址
    let user = leancloud_storage.AV.User.current()
    let temp_tips = 0
    if (this.data.address_details !== '' && this.data.address_name !== '' && this.data.address_telephone !== '') {

      _uesr_address.province_city = this.data.region.join("")
      _uesr_address.address_details = this.data.address_details
      _uesr_address.address_name = this.data.address_name
      _uesr_address.address_telephone = this.data.address_telephone
      _uesr_address.chose = this.data.chose_flg
      temp_address.push(_uesr_address)

      if (this.data.chose_flg) {
        //新增chose为true，之前所有chose改为false
        for (let i = 0; i < this.data.user_address.length; i++) {
          let temp_key = 'user_address[' + i + '].chose'
          this.setData({
            [temp_key]: false
          })
        }
      } else {
        //新增chose为false，且之前所有chose也为false。提示设置默认地址
        for (let i = 0; i < this.data.user_address.length; i++) {
          if (this.data.user_address[i].chose === false) {
            temp_tips++
          }
        }
      }
      if (temp_tips !== this.data.user_address.length) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '添加成功，请注意设置默认地址',
          icon: 'none',
          duration: 2000
        })
      }
      this.setData({
        address_flg: true,
        modal_hidden: true,
        user_address: this.data.user_address.concat(temp_address),
      })
      user.set('address', this.data.user_address)
      user.save()
    } else {
      wx.showToast({
        title: '输入错误,地址不能为空',
        icon: 'none',
        duration: 2000
      })
    }
  },

  cancel_modal: function(e) { //模态取消
    this.setData({
      modal_hidden: true,
    })
  },

  get_input_value: function(e) {
    let that = this
    switch (e.currentTarget.id) {
      case 'address_details':
        that.setData({
          address_details: e.detail.value
        });
        break
      case 'address_telephone':
        that.setData({
          address_telephone: e.detail.value
        });
        break
      case 'address_name':
        that.setData({
          address_name: e.detail.value
        });
        break
    }
  },

  bindRegionChange: function(e) { //picker省市区选择，新增
    this.setData({
      region: e.detail.value,
    })
  },

  edit_bindRegionChange: function(e) { //picker省市区选择，编辑
    this.setData({
      region: e.detail.value,
    })
  },

  edit_input_value: function(e) {
    let that = this
    switch (e.currentTarget.id) {
      case 'edit_address_details':
        that.setData({
          edit_address_details: e.detail.value
        });
        break
      case 'edit_address_telephone':
        that.setData({
          edit_address_telephone: e.detail.value
        });
        break
      case 'edit_address_name':
        that.setData({
          edit_address_name: e.detail.value
        });
        break
    }
  },

  edit_address: function(e) { //点击编辑地址
    let index = e.currentTarget.dataset.index;
    this.setData({ //设置打开后默认地址信息
      edit_modal_hidden: false,
      edit_index: index,
      region: this.data.user_address[index].province_city,
      edit_address_details: this.data.user_address[index].address_details,
      edit_address_name: this.data.user_address[index].address_name,
      edit_address_telephone: this.data.user_address[index].address_telephone,
      edit_chose: this.data.user_address[index].chose
    })
  },

  edit_confirm_modal: function(e) { //编辑确定
    let user = leancloud_storage.AV.User.current()
    let province_city = 'user_address[' + this.data.edit_index + '].province_city'
    let name = 'user_address[' + this.data.edit_index + '].address_name'
    let telephone = 'user_address[' + this.data.edit_index + '].address_telephone'
    let details = 'user_address[' + this.data.edit_index + '].address_details'
    let chose = 'user_address[' + this.data.edit_index + '].chose'
    let temp_tips = 0
    if (this.data.edit_address_details !== '' && this.data.edit_address_name !== '' && this.data.edit_address_telephone !== '') {
      if (this.data.chose_flg) {
        //新增chose为true，之前所有chose改为false
        for (let i = 0; i < this.data.user_address.length; i++) {
          let temp_key = 'user_address[' + i + '].chose'
          this.setData({
            [temp_key]: false
          })
        }
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        //新增chose为false，且之前所有chose也为false。提示设置默认地址
        for (let i = 0; i < this.data.user_address.length; i++) {
          if (this.data.user_address[i].chose === false) {
            temp_tips++
          }
        }
        wx.showToast({
          title: '修改成功，请注意设置默认地址',
          icon: 'none',
          duration: 2000
        })
      }
      this.setData({
        edit_modal_hidden: true,
        [province_city]: this.data.region,
        [name]: this.data.edit_address_name,
        [telephone]: this.data.edit_address_telephone,
        [details]: this.data.edit_address_details,
        [chose]: this.data.chose_flg
      })
      user.set('address', this.data.user_address)
      user.save()
      console.log(this.data.user_address)
    } else {
      wx.showToast({
        title: '输入错误,地址不能为空',
        icon: 'none',
        duration: 2000
      })
    }
  },

  edit_cancel_modal: function() { //编辑取消
    this.setData({
      edit_modal_hidden: true,
    })
  },

  checkboxChange: function(e) { //默认地址选择
    this.setData({
      chose_flg: Boolean(e.detail.value[0])
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