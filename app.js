var express = require('express');
var session = require('express-session');
var RedisStore = require("connect-redis")(session);
var redis = require("redis");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var log = require('./helper/logHelper');
var options = {
  host: "127.0.0.1",
  port: 6379,
  ttl: 10800
}
var models = require('./model/index');
var client = redis.createClient();
//log4js记录日志
log.use(app);
//输出redis错误信息
client.on("error", function(err) {
  console.log("Error" + err);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//favicon.ico 配置
app.use(favicon(__dirname + "/static/assets/images/favicon.ico"));
//静态文件路径配置
app.use(express.static(path.join(__dirname, 'static')));
//开发环境下打印日志
app.use(logger('dev'));
//解析数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//配置session
app.use(session({
  store: new RedisStore(options),
  secret: 'express is powerful',
  resave: false,
  saveUninitialized: true,
  name: "sessionid"
}));
//映射表关系到model上
app.use(function(req, res, next) {
 models(function(err, db) {
 if(err) return next(err);
 req.models = db.models;
 req.db = db;
 return next();
 });
 });
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
  //404错误导航到error模板显示错误代码
  app.use(function(err, req, res, next) {
    res.status(err.status || 404);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
  //500错误导航到error模板显示错误代码
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}
//生产环境异常页面配置待续。
/**
 * 路由扩展
 */
var login = require("./routes/login");
var user = require("./routes/user");
var index = require("./routes/index");
app.use("/", login.routes);
app.use("/user", user);
app.use("/index",index);

module.exports = app;
