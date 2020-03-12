let AV = require('./av-weapp-min.js');
let query = new AV.Query('backstage_username');
let business_data = new AV.Query('business_data');

module.exports = {
  AV: AV,
  query: query,
  business_data: business_data
}