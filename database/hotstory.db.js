var mysql = require('mysql'),
    helper = require('../routes/helper'),
    config = require('./config.db');
var con = mysql.createConnection(config);

var Hotstory = function(hotstory) {
    this.props = hotstory.props  //参数集合，借鉴react设计思想
};

Hotstory.prototype.getAllHotstories = function(callback) {
    var _sql = "select * from hotstory";
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getUserAllItems',
        callback: callback
    })
}
Hotstory.prototype.getLatestHotstories = function(duration, limit, callback) {
    let start = new Date();
    start.setSeconds(start.getSeconds() - duration);
    let current = new Date();
    let startTs = Math.floor(start.getTime() / 1000);
    let currentTs = Math.floor(current.getTime() / 1000);
    console.log(startTs);
    console.log(currentTs);
    let escapedStartStr = con.escape(startTs);
    let escapedCurrentStr = con.escape(currentTs);
    let escapedLimit = con.escape(limit);
    var _sql = 'select * from hotstory where create_ts between ' +
        escapedStartStr + ' and ' + escapedCurrentStr + 
        ' order by hotstory_id DESC ' + ' LIMIT ' + escapedLimit; 
    console.log("sql: " + _sql);
    helper.db_query({
        connect: con,
        sql: _sql,
        name: 'getLatestHotstories',
        callback: callback
    });
}

module.exports = Hotstory