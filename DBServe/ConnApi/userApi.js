const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const moudle = require('../ValueSome/db')
const $sql = require('../ValueSome/sqlMap');
const conn = mysql.createConnection(moudle.mysql);
conn.connect();

//显示连接数据测试用
const sel_email = $sql.user.search;
conn.query(sel_email, function (error, results) {
    if (error) {
        throw error;
    }
    console.log(results)
    if (results[0] === undefined) {
        console.log("???");
    }
});

//登录接口
router.post('/login',(req,res)=>{
    const user = req.body;
    const sel_email = $sql.user.search+" where ID='"+user.ID+"'";
    console.log(sel_email);
    conn.query(sel_email, user.ID, (error, results)=>{
        if (error) {
            throw error;
        }
        console.log(results)
        if (results[0] === undefined) {
            res.send("-1");  // -1 表示查询不到，用户不存在，即邮箱填写错误
        } else{
            if (results[0].ID === user.ID && results[0].Password === user.Password) {
                console.log(results[0].ID);
                const strSql1=$sql.user.search + " where ID='"+results[0].ID+"'";
                conn.query(strSql1,(error)=>{
                    if(error){
                        throw error;
                    }else {
                        res.send({ID: results[0].ID, Password: results[0].Password});
                    }
                })//正确则会传回前端数据
            } else{
                res.send("1");  // 1 表示用户存在，但密码不正确
            }
        }
    })
});

module.exports = router;
