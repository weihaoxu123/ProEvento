var express = require('express');
var sqlObj=require("../db/sql")
var connection=require("../db/db_conn")
var jwt = require('jsonwebtoken');
var authenticationCheck=function(req,res,next){
    if(req.cookies.token){
      jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
        if(err){
          res.redirect("/login")
        }
        else{
          // return next()
          params=decoded.userName
          connection.query(sqlObj.searchSpecificPeople,params,function(err,result){
            if(err){
                console.log(err)
                throw err
            }
            else{
                if(result[0].deactivated){
                  res.render("../views/profile/ownProfile.jade",{user:result[0]})
                }
                else{
                    return next()
                }
            }
          })
        }
      });
    }
    else{
      res.redirect("/login")
    }
  }
  module.exports=authenticationCheck