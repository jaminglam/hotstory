module.exports = {
    // 获取本地时间字符串
    getTimeString: function(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +
            date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() +
            ':' + date.getSeconds();
    },
    // 执行sql语句
    db_query(opt) {
        opt.connect.query(opt.sql, function(err, res) {
        if (err) {
          console.log(`${opt.name} err: + ${err}`);
        } else {
          console.log(`${opt.name} success!`);
          if (typeof(opt.callback) === 'function') {
            opt.callback(err, res);
          }
        }
      });
    }
}