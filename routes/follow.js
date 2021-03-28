var express = require('express');
var router = express.Router();
var sqlObj=require("../db/sql")
var connection=require("../db/db_conn")
var jwt = require('jsonwebtoken');
var authenticationCheck=require("../middleware/authenticationCheck")
router.post("/:userName",authenticationCheck,function(req,res,next){
    params=[]
    params[0]=req.params.userName
    params[1]=req.params.userName
    jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
        if(err){
          res.render("error")
        }
        else{
            params[0]=decoded.userName
            connection.query(sqlObj.followSomeone,params,function(err,result){
                if(err){
                    console.log(err)
                    res.json({
                        code: 1,
                        message: 'failed'
                    })
                }
                else{
                    res.json({
                        code: 200,
                        message: 'success'
                    })
                }
            })
        }
    });
})
router.post("/delete/:userName",authenticationCheck,function(req,res,next){
    params=[]
    params[0]=req.params.userName
    params[1]=req.params.userName
    jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
        if(err){
          res.render("error")
        }
        else{
            params[0]=decoded.userName
            connection.query(sqlObj.unFollowSomeone,params,function(err,result){
                if(err){
                    console.log(err)
                    res.json({
                        code: 1,
                        message: 'failed'
                    })
                }
                else{
                    res.json({
                        code: 200,
                        message: 'success'
                    })
                }
            })
        }
    });
})
module.exports=router