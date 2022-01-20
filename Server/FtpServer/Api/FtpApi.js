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
    form.uploadDir='/home/douqiuyu343/WebstormProjects/vueftpserve/Server/FtpServer/SwapFile';
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
                    c.append(files.file[0].path, fields.FileName+'/'+files.file[0].originalFilename+"[提交者："+fields.ID[0]+"]",function (err){
                        if(err) throw err;
                    })
                    c.end();
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

//new操作/FtpNewFile
router.post('/FtpNewFile',(req,res)=>{
    const user = req.body;
    console.log(user)
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
                console.log(user.FileName);
                c.mkdir(user.FileName+'/'+user.FileNa+"[创建者："+user.ID+"]", false,function (mkdirerr){
                   if(mkdirerr) throw mkdirerr;
                });
            });
            // connect to localhost:21 as anonymous
            c.connect(module1.LinkFtp);
        }
    })
})

//删除操作
router.post('/ftpDelete',(req,res)=>{
    const user = req.body;
    console.log(user)
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
                if(user.FileType==="文件"){
                    c.delete(user.FileName+'/'+user.FilePath,function (deleteerr){
                        if(deleteerr) {
                            console.log(deleteerr);
                            res.send("-1");
                        }else {
                            res.send("1");
                        }
                    })
                }else if(user.FileType==="文件夹") {
                    c.rmdir(user.FileName+'/'+user.FilePath,false,function (rmdirerr){
                        if(rmdirerr) {
                            console.log(rmdirerr);
                            res.send("-1");
                        }else{
                            res.send("1");
                        }
                    })
                }

            });
            // connect to localhost:21 as anonymous
            c.connect(module1.LinkFtp);
        }
    })
})

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