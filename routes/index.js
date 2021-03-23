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
router.get('/plaza',authenticationCheck ,function(req, res, next) {
  res.render("plaza")
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
//search for people
router.post('/people',function(req, res, next) {

  params=[]
  params[0]=req.body.string+"%"
  connection.query(sqlObj.searchPeople,params,function(err,result){
    if(err){
        console.log(err)
        throw err
    }
  else{res.render("component/peopleSearch.jade",{list:result})}
})

});
//search for event
router.post('/searchEvent',function(req, res, next) {

  params=[]
  params[0]=req.body.string+"%"
  connection.query(sqlObj.searchEvent,params,function(err,result){
    if(err){
        console.log(err)
        throw err
    }
  else{res.render("component/eventSearch.jade",{list:result})}
})

});
//mark an event as started
router.post('/event/started',function(req,res,next){
  console.log("reach!")
  var event_id=req.body.event_id
  params=[]
  params[0]=event_id
  console.log(req.body)
  connection.query(sqlObj.startEvent,params,function(err,result){
    if(err){
      return res.json({
        code: 1,
        message: 'failure'
    })
    }
    else{
      console.log(result)
      return res.json({
        code: 200,
        message: 'success'
    })
  }
}
  )
})
//mark an event as completed
router.post('/event/completed',function(req,res,next){
  var event_id=req.body.event_id
  params=[]
  params[0]=event_id
  connection.query(sqlObj.endEvent,params,function(err,result){
    if(err){
      return res.json({
        code: 1,
        message: 'failure'
    })
    }
    else{
      console.log(result)
      return res.json({
        code: 200,
        message: 'success'
    })
  }
}
  )
})
//ger specific event
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
            
            res.render("ownEvent",{eventA:result[0]})
          }
          else{
            console.log(result)
            res.render("othersEvent",{eventA:result[0]})
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
