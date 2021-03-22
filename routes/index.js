var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var sqlObj=require("../db/sql")
var connection=require("../db/db_conn")
/* GET home page. */
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
router.get('/',authenticationCheck ,function(req, res, next) {
  res.render("index")
});
router.get('/addEvent',authenticationCheck,function(req, res, next) {
  res.render("addEvent")
});
router.get('/myEvent',authenticationCheck,function(req, res, next) {
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
    if(err){
      res.render("error")
    }
    else{
      params=[]
      params=decoded.userName
      connection.query(sqlObj.myEventList,params,function(err,result){
        if(err){
            console.log(err)
            throw err
        }
      res.render("myEvent",{list:result})
    })
    
    }
  });
});
router.get('/event/:eventId',authenticationCheck,function(req, res, next) {
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
    if(err){
      res.render("error")
    }
    else{
      var userName=decoded.userName
      var eventId= req.params.eventId
      params=[]
      params=eventId
      connection.query(sqlObj.getEvent,params,function(err,result){
        if(err){
            console.log(err)
            throw err
        }
        if(result.length==0){
          res.send("not such event")
          return
        }
        else{
          if(result[0].owner==(userName)){
            console.log(result)
            res.render("ownEvent",{event:result[0]})
          }
          else{
            res.send("hello")
          }
        } 
    })
    
    }
  });
});
router.post("/event",function(req,res,next){
  if(req.cookies.token){
    jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
      if(err){
        return res.json({
          code: 1,
          message: '失败'
      })
      }
      else{
          params=[]
          params[0]=req.body.title
          params[1]=decoded.userName
          params[2]=req.body.description
          params[3]=req.body.link
          params[4]=req.body.time
          params[5]=req.body.category
          params[6]=req.body.imgPath
          connection.query(sqlObj.insertEvent,params,function(err,result){
            if(err){
                console.log(err)
                throw err
            }
            else{
                return res.json({
                    code: 200,
                    message: '添加event成功'
                })
            }
        })
      }
    });
  }
  else{
    return res.json({
      code: 1,
      message: '失败'
  })
  }



})
module.exports = router;
