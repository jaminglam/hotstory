var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var expressWs = require('express-ws')(app, server);

var api = require('./routes/api.js');
var config = require('./config.js');
// mysql db for websocket
var Hotstory = require('./database/hotstory.db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function broadcastWsMsg(msg) {
  expressWs.getWss().clients.forEach(function each(websocket) {
    if (websocket.isAlive === false) return websocket.terminate();
    websocket.send(msg);
  });
}

function periodicalBroadcast() {
  console.log('try to get latest hotstories');
  var props = {};
  var hotstory = new Hotstory({props: props});
  var duration = config.duration;
  var limit = config.limit;
  hotstory.getLatestHotstories(limit ,function(err, data) {
    if (data.length) {
      broadcastWsMsg(JSON.stringify(data));
    } else {
      console.log(err);
      let resp = {
        "code": 0,
        "msg": "failed get latest hotstories",
      }
      broadcastWsMsg(JSON.stringify(resp));
    }
  });
}

// websocket
periodicalBroadcast();
setInterval(periodicalBroadcast, 60000);

// module.exports = app;
module.exports = {app: app, server: server};
