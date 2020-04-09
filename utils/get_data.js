let AV = require('./av-weapp-min.js');
let business_data = new AV.Query('business_data');
let _user = new AV.Query('_User');
let order_data = new AV.Query('order_data');

module.exports = {
  AV: AV,
  business_data: business_data,
  _user: _user,
  order_data: order_data
}