var Hotstory = require('../../database/hotstory.db');
module.exports = {
    // 模块初始化
    init: function(app) {
        app.get('/hotstory', this.doGetAllHotstories)
    },
    // 获取所有用户信息
    doGetAllHotstories: function(req, res) {
        var props = {};  //默认参数为空
        var hotstory = new Hotstory({props: props});
        hotstory.getAllHotstories(function(err, data) {
            if (data.length) {
                return res.send({
                    code: 200,
                    data: data
                })
            } else {
                console.log(err)
                return res.send({
                    code: 500,
                    message: '出错了'
                })
            }
        })
    }
}