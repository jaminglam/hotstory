var Hotstory = require('../../database/hotstory.db');
var config = require('../../config');
module.exports = {
    broadcastData: function(ws, req) {
      var props = {};  //默认参数为空
      var hotstory = new Hotstory({props: props});
      let data = hotstory.getLatestHotstories(
        config.backend.latestHotstoryLimit,
        function (err, data) {
          if (err) {
            console.log('empty data');
            ws.send(JSON.stringify([]));
          } else {
            ws.send(JSON.stringify(data));
          }
        });
      // console.log('data: ');
      // console.log(JSON.stringify(data));
      // ws.send(JSON.stringify(data));
      console.log('send data done');
    },
    init: function(app) {
        app.ws('/testws', this.broadcastData);

    },
}