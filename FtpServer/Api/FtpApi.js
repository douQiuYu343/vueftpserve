const express = require('express');
const router = express.Router();
//const Client = require('ftp');
//const module1 = require('../Config/Config')

//获取FTP文件服务器列表
//const c = new Client();
//c.on('ready', function() {
//    c.list(function(err, list) {
//        if (err) throw err;
 //       console.dir(list);
//        c.end();
//    });
//});
// connect to localhost:21 as anonymous
//c.connect(module1.LinkFtp);

//上传文件
//const c1 = new Client();
//
//c1.on('ready', function() {
 //   c1.put('foo.txt1111', '你好.txt', function(err) {
 //       if (err) throw err;
  //      console.dir("ok");
   //     c1.end();
   // });/
//});
//c1.connect(module1.LinkFtp);

module.exports = router;