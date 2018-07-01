var mysql = require('mysql'),
    helper = require('../routes/helper'),
    config = require('./config.db');
var con = mysql.createConnection(config);
console.log("mysql user: " + config.user);
/*用户模块 构造方法*/
var Hotstory = function(hotstory) {
    this.props = hotstory.props  //参数集合，借鉴react设计思想
};
/*获取全部数据,测试接口使用，正式上线时请关闭*/
Hotstory.prototype.getAllHotstories = function(callback) {
    var _sql = "select * from hotstory";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserAllItems',
        callback: callback
    })
}
module.exports = Hotstory