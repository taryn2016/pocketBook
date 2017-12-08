var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var appdb = require('./app.js')
var app = express();
var router = express.Router();
var bodyParser = require("body-parser")
var nodemailer = require('nodemailer')// 邮件
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  port: '3306',
  database: 'pocketBookDB'
});
var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '1981138151@qq.com',
    pass: 'isbvzsgblsnmcfjj' //授权码,通过QQ获取
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
//设置跨域访问，不需要每个接口都设置
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

router.post('/CreateUser', function (req, res) {
  let date = new Date().getTime()
  let data = JSON.parse(Object.keys(req.body)[0])
  let sql1 = 'select max(userid) as maxid from user_info;'
  connection.query(sql1, function (err, result) {
    if(err){
      console.log('[CreateUser] - ',err.message);
      return;
    }
    // 若没有查到result[0].maxid为null
    // 查出来的数据是数组
    let userid
    if(result[0].maxid) {
      userid = result[0].maxid + 1
    } else {
      userid = 10001
    }
    let sql = `INSERT user_info(userid, email, password, usertoken, createtime, expiretime, activated) values
    (${userid},'${data.email}', '${data.password}', '${data.usertoken}', ${Date.now()}, ${Date.now() + 60*60*60*24*7}, 0)`
    connection.query(sql, function (err, result) {
      if(err){
        console.log('[CreateUser] - ',err.message);
        return;
      }
      res.json(result)
    })
  })
  var mailOptions = {
    from: '1981138151@qq.com', // 发送者
    to: data.email, // 接受者,可以同时发送多个,以逗号隔开
    subject: 'nodemailer2.5.0邮件发送', // 标题
    text: 'Hello world', // 文本
    html: `<h2>nodemailer基本使用:</h2><h3>
    <a href="http://127.0.0.1:3000/ActivateUser?useEmail=${data.email}">
    点击激活</a></h3>`
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('发送成功');
  });
})
router.get('/ActivateUser', function (req, res) {
  var useEmail = req.query.useEmail
  console.log(useEmail);
  var sql = `update user_info set activated=1 where email='${useEmail}'`
  connection.query(sql, function (err, result) {
    if(err){
      console.log('[CreateUser] - ',err.message);
      return;
    }
    res.write('<!DOCTYPE html><html data-dpr="1"><head><meta charset="utf-8"><title>pocket-book</title></head><body><p>激活成功</p></body></html>')
  })
})
module.exports = app;
