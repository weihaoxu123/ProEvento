var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var authenticationCheck=function(req,res,next){
    if(req.cookies.token){
      jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
        if(err){
          res.redirect("/login")
        }
        else{
          return next()
        }
      });
    }
    else{
      res.redirect("/login")
    }
  }
  module.exports=authenticationCheck