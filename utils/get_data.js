let AV = require('./av-weapp-min.js');
let business_data = new AV.Query('business_data');
let _user = new AV.Query('_User')

module.exports = {
  AV: AV,
  business_data: business_data,
  _user: _user
}