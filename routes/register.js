var express = require('express');
var router = express.Router();
var sqlObj=require("../db/sql")
var connection=require("../db/db_conn")
var jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
  res.render("register");
});
params=[]
router.post('/', function(req, res, next) {
    params[0]=req.body.userName
    params[1]=req.body.password
    console.log(params)

    connection.query(sqlObj.selectUser,params.slice(0,1),function(err,result){
        if(err){
            console.log(err)
            throw err
        }
        else{
            if((result.length)!=0){
                return res.json({
                    code: 1,
                    message: '用户已存在'
                })
            }
            else{
                connection.query(sqlObj.register,params,function(err,result){
                    if(err){
                        console.log(err)
                        throw err
                    }
                    else{
                        var token = jwt.sign({ userName: params[0] }, 'shhhhh',{expiresIn:3600});
                        res.cookie("token",token)
                        return res.json({
                            code: 200,
                            message: '注册成功'
                        })
                    }
                })
            }
        }
    })
  });

module.exports = router;