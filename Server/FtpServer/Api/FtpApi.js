const express = require('express');
const router = express.Router();
const Client = require('ftp');
const mysql = require('mysql');
const moudle = require('../../DBServe/ValueSome/db')
const $sql = require('../../DBServe/ValueSome/sqlMap');
const module1 = require('../Config/Config')
const multiparty = require("multiparty");
const conn = mysql.createConnection(moudle.mysql);
conn.connect();

//FtpListFound
router.post('/FtpListLook',(req,res)=>{
    const user = req.body;
    const sel_email = $sql.user.search+" where ID='"+user.ID+"'";
    console.log(sel_email);
    conn.query(sel_email, user.ID, (error, results)=>{
        if (error) {
            throw error;
        }
        console.log(results[0].FTPID)
        module1.LinkFtp.user=results[0].FTPID;
        module1.LinkFtp.password=results[0].FTPID;
        if (results[0].FTPID === undefined) {
            res.send("-1");  // -1 表示查询不到
        } else {
            var c = new Client();
            c.on('ready', function() {
                c.list(function(err, list) {
                    if (err) throw err;
                    list.map(item => {
                        item.name = Buffer.from(item.name, 'binary').toString('utf8')
                        // item.name = Buffer.from(item.name, 'binary').toString('utf8') // 若设置了传输数据类型为ASCII
                    })
                    res.send({tableData:list});
                    c.end();
                });
            });
            // connect to localhost:21 as anonymous
            c.connect(module1.LinkFtp);
        }
    })
})

///FtpListFound
router.post('/FtpListFound',(req,res)=>{
    const user = req.body;
    const sel_email = $sql.user.search+" where ID='"+user.ID+"'";
    console.log(sel_email);
    conn.query(sel_email, user.ID, (error, results)=>{
        if (error) {
            throw error;
        }
        console.log(results[0].FTPID)
        module1.LinkFtp.user=results[0].FTPID;
        module1.LinkFtp.password=results[0].FTPID;
        if (results[0].FTPID === undefined) {
            res.send("-1");  // -1 表示查询不到
        } else {
            var c = new Client();
            c.on('ready', function() {
                console.log(user.FileName)
                if(user.FileName){
                    console.log('ok')
                }else{
                    user.FileName='/..'
                }
                console.log(user.FileName)
                c.cwd(user.FileName,function (){
                    c.list(function(err, list) {
                        if (err) throw error;
                        list.map(item => {
                            item.name = Buffer.from(item.name, 'binary').toString('utf8')
                            // item.name = Buffer.from(item.name, 'binary').toString('utf8') // 若设置了传输数据类型为ASCII
                        })
                        res.send({tableData:list});
                    });
                    c.end();
                })
            });
            // connect to localhost:21 as anonymous
            c.connect(module1.LinkFtp);
        }
    })
})

//上传操作
router.post('/upload/headImage', function(req, res) {
    let form = new multiparty.Form();
    form.uploadDir='/home/douqiuyu343/WebstormProjects/vueftpserve/FtpServer/SwapFile';
    form.keepExtensions=true;   //是否保留后缀
    form.parse(req,function(err,fields,files){  //其中fields表示你提交的表单数据对象，files表示你提交的文件对象
        console.log(fields,files);
        const sel_email = $sql.user.search+" where ID='"+fields.ID[0]+"'";
        var c = new Client();
        conn.query(sel_email,fields.ID[0] , (error, results)=>{
            if (error) {
                throw error;
            }
            console.log(results[0].FTPID)
            module1.LinkFtp.user=results[0].FTPID;
            module1.LinkFtp.password=results[0].FTPID;
            if (results[0].FTPID === undefined) {
                res.send("-1");  // -1 表示查询不到
            } else {
                c.on('ready', function () {
                    c.cwd(fields.FileName[0],function (){
                        c.list(function(err, list) {
                            if (err) throw error;
                            list.map(item => {
                                item.name = Buffer.from(item.name, 'binary').toString('utf8')
                                // item.name = Buffer.from(item.name, 'binary').toString('utf8') // 若设置了传输数据类型为ASCII
                            })
                            c.put(files.file[0].path, fields.FileName+'/'+files.file[0].originalFilename, function (err) {
                                if (err) throw err;
                                c.end()
                            });
                        });
                        c.end();
                    })
                });
                c.connect(module1.LinkFtp);
            }
        })
        if(err){
            res.json({
                status:"1",
                msg:"上传失败！"+err
            });
        }else{
            res.json({
                status:"0",
                msg:"上传成功！",
                imgSrc: files.image
            });
        }
    })
})

//上传操作


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


module.exports = router;