var express = require('express');
var router = express.Router();
var sqlObj=require("../db/sql")
var connection=require("../db/db_conn")
var jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
    if(req.cookies.token){
        jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
            if(err){
                res.render("login",{title:"login"});
            }
            else{
                res.redirect("/")
            }
        });
    }
    else{
        res.render("login",{title:"login"});
    }
  
});
router.post('/', function(req, res, next) {
    params=[]
    params[0]=req.body.userName
    params[1]=req.body.password
    connection.query(sqlObj.loginCheck,params,function(err,result){
        if(err){
            console.log(err)
            throw err
        }
        else{
            if((result.length)!=0){
              // set cookie
              var token = jwt.sign({ userName: params[0] }, 'shhhhh',{expiresIn:3600});
              res.cookie("token",token)
                return res.json({
                    code: 200,
                    message: '登录成功'
                })
            }
            else{
                
                return res.json({
                    code: 1,
                    message: '登录失败'
                })
                    
            }
        }
    })
  });
module.exports = router;