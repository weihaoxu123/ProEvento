var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var sqlObj=require("../db/sql")
var connection=require("../db/db_conn")
var sync_connection=require("../db/sync_db_conn")
var authenticationCheck=require("../middleware/authenticationCheck")
var deactivatedCheck=require("../middleware/deactivatedCheck")

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
router.get('/myProfile',authenticationCheck,function(req, res, next) {
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
    if(err){
      res.render("error")
    }
    else{
      params=[]
      params[0]=decoded.userName
      connection.query(sqlObj.searchSpecificPeople,params,function(err,result){
        if(err){
            console.log(err)
            throw err
        }
        else{
          if(result.length==0){
            //no such user
            res.send("no such user")
          }
          else{
            res.render("./profile/ownProfile.jade",{user:result[0]})
          }
        }
      })
    }
  });
});
router.get('/user/:userName/following',deactivatedCheck,authenticationCheck,function(req, res, next) {
  params=[]
  params[0]=req.params.userName
  connection.query(sqlObj.getFollowingList,params,function(err,result){
    if(err){
      console.log(err)
      throw err
    }
    else{
      console.log(result)
      res.render("./profile/following.jade",{list:result})
    }
});
})
router.get('/user/:userName/follower',deactivatedCheck,authenticationCheck,function(req, res, next) {
  params=[]
  params[0]=req.params.userName
  connection.query(sqlObj.getFollowedList,params,function(err,result){
    if(err){
      console.log(err)
      throw err
    }
    else{
      res.render("./profile/follower.jade",{list:result})
    }
});
});
router.get('/user/:userName/group',authenticationCheck,function(req, res, next) {
      params=[]
      params[0]=req.params.userName
      connection.query(sqlObj.searchSpecificPeople,params,function(err,result){
        if(err){
            console.log(err)
            throw err
        }
        else{
          
          connection.query(sqlObj.getGroupList,params,function(err,outcome){
            console.log(outcome)
            res.render("./profile/myGroup.jade",{user:result[0],list:outcome})
          })
        }
      })

});
router.get('/user/:userName/createGroup',authenticationCheck,function(req, res, next) {
  res.render("./profile/createGroup.jade")
});
router.get('/user/:userName',deactivatedCheck,authenticationCheck,function(req, res, next) {
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
    if(err){
      //not log in
      res.render("error")
    }
    else{
      params=[]
      params=req.params.userName

      connection.query(sqlObj.searchSpecificPeople,params,function(err,result){
        if(err){
            console.log(err)
            throw err
        }
        else{
          console.log(result)
          if(result.length==0){
            //no such user
            res.send("no such user")
          }
          else{
            if(decoded.userName==req.params.userName){
              //viewing your own profile page
              res.render("./profile/ownProfile.jade",{user:result[0]})
            }
       
            else{
                connection.query(sqlObj.myEventList,params,function(err,outcome){
                  if(err){
                      console.log(err)
                      throw err
                  }
                  params=[]
                  params[0]=decoded.userName
                  params[1]=req.params.userName
                  connection.query(sqlObj.checkFollowStatus,params,function(err,followStatus){
                    if(err){
                      console.log(err)
                      throw err
                    }
                    else{
                      console.log(followStatus.length)
                      if(followStatus.length==0){
                        res.render("./profile/othersProfile.jade",{user:result[0],list:outcome,follow:false})
                      }
                      else{
                        res.render("./profile/othersProfile.jade",{user:result[0],list:outcome,follow:true})
                      }
                    }
                  })
              })
        
              
            }
          }
        }
      })
    }
  });
});
router.post('/user/:userName',authenticationCheck,function(req, res, next) {
  // updateProfile:"update user set gender=?, profession=?,avtar=?,motto=?,birthday=? where userName=?",
  params=[]
  params[0]=req.body.gender
  params[1]=req.body.profession
  params[2]=req.body.avtar
  params[3]=req.body.motto
  params[4]=req.body.birthday
  params[5]=req.params.userName

  connection.query(sqlObj.updateProfile,params,function(err,result){
    if(err){
        console.log(err)
        return res.json({
          code: 1,
          message: 'failure'
        })
    }
    else{
      return res.json({
        code: 200,
        message: 'success'
      })
    }
  })
});
router.post("/deactivate/:userName",function(req,res,next){
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
    if(err){
      //not log in
      res.render("error")
    }
    else{
      if(req.params.userName!=decoded.userName){
        //people can only deactivate their own event
        res.render("error")
      }
      else{
        params=decoded.userName
        connection.query(sqlObj.deactivaeSomeone,params,function(err,result){
          if(err){
            console.log(err)
            return res.json({
              code: 1,
              message: 'failure'
            })
          }
          else{
            return res.json({
              code: 200,
              message: 'success'
            })
          }
        })
      }
    }
  })
})
router.post("/activate/:userName",function(req,res,next){
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
    if(err){
      //not log in
      res.render("error")
    }
    else{
      if(req.params.userName!=decoded.userName){
        //people can only activate their own event
        res.render("error")
      }
      else{
        params=decoded.userName
        connection.query(sqlObj.activateSomeone,params,function(err,result){
          if(err){
            console.log(err)
            return res.json({
              code: 1,
              message: 'failure'
            })
          }
          else{
            return res.json({
              code: 200,
              message: 'success'
            })
          }
        })
      }
    }
  })
})
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
})
//search for group
router.post('/search/group',function(req, res, next) {

  params=[]
  params[0]=req.body.string+"%"
  connection.query(sqlObj.searchGroup,params,function(err,result){
    if(err){
        console.log(err)
        throw err
    }
  else{res.render("component/groupSearch.jade",{list:result})}
})
})
//search for hashtag
router.post('/search/hashtag',function(req, res, next) {

  params=[]
  params[0]=req.body.string
  connection.query(sqlObj.searchHashtag,params,function(err,result){
    if(err){
        console.log(err)
        throw err
    }
    else{
      event_list=[]
      for(var i=0;i<result.length;i++){
        params=[]
        params[0]=result[i].event_id
        event_obj=sync_connection.query(sqlObj.getEvent,params)
        event_list.push(event_obj[0])
      }
      res.render("component/eventSearch.jade",{list:event_list})
    }
})
})
router.post('/people_group',function(req, res, next) {
  invited=[]
  params=[]
  params[0]=req.body.string+"%"
  connection.query(sqlObj.searchPeople,params,function(err,result){
    if(err){
        console.log(err)
        throw err
    }
  else{
    for(var i=0;i<result.length;i++){
      params=[]
      params[0]=req.body.groupId
      params[1]=result[i].userName
      const outcome=sync_connection.query(sqlObj.checkGroupStatus,params)
      if(outcome.length==0){
        invited.push(false)
      }
      else{
        invited.push(true)
      }
    }
    res.render("component/peopleSearchGroup.jade",{list:result,invited:invited})
  }
})
})

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
router.post('/searchEventByDate',function(req, res, next) {

  params=[]
  params[0]=req.body.string+"%"
  connection.query(sqlObj.searchEventByDate,params,function(err,result){
    if(err){
        console.log(err)
        throw err
    }
  else{res.render("component/eventSearch.jade",{list:result})}
})

});
//mark an event as started
router.post('/event/started',function(req,res,next){
  var event_id=req.body.event_id
  params=[]
  params[0]=event_id
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
    if(err){
      //not log in
      return res.json({
        code: 1,
        message: 'not log in'
      })
    }
    else{
      params[1]=decoded.userName
      connection.query(sqlObj.startEvent,params,function(err,result){
        if(err){
          return res.json({
            code: 1,
            message: 'failure'
          })
        }
        else{
          if(result.affectedRows==1){
            return res.json({
              code: 200,
              message: 'success'
            })
          }
          else{
            return res.json({
              code: 1,
              message: "you don't own this event"
            })
          }

        }
      })
    }
  })
  
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
      params[0]=eventId
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
          hashTags=sync_connection.query(sqlObj.getAllHashtag,params)
          console.log(hashTags)
          if(result[0].owner==(userName)){
            res.render("ownEvent",{eventA:result[0],hashTags:hashTags})
          }
          else{
            console.log(result)
            res.render("othersEvent",{eventA:result[0],hashTags:hashTags})
          }
        } 
      })
    
    }
  });
});
router.get('/group/:groupId',authenticationCheck,function(req, res, next) {
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
    if(err){
      res.render("error")
    }
    else{
      var userName=decoded.userName
      var groupId= req.params.groupId
      params=[]
      params[0]=groupId
      connection.query(sqlObj.getGroup,params,function(err,result){
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
            outcome=sync_connection.query(sqlObj.getMemberList,params)
            console.log(outcome)
            res.render("ownGroup",{group:result[0],group_member:outcome})
          }
          else{
            params=[]
            params[0]=groupId
            params[1]=userName
            inGroup=false
            outcome=sync_connection.query(sqlObj.checkGroupStatus,params)
            if(outcome.length){
              inGroup=true
            }
            res.render("othersGroup",{group:result[0],inGroup:inGroup})
          }
        } 
      })
    
    }
  });
});
router.get('/group/:groupId/requested',authenticationCheck,function(req, res, next) {
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
    if(err){
      res.render("error")
    }
    else{
      var userName=decoded.userName
      var groupId= req.params.groupId
      params=[]
      params[0]=groupId
      connection.query(sqlObj.getRequestList,params,function(err,result){
        console.log(result)
        res.render("groupRequested",{list:result})
      })
    
    }
  });
});
router.get("/event/:eventId/join",authenticationCheck,function(req,res,next){
  var eventId=req.params.eventId
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
    if(err){
      res.render("error")
    }
    else{
      params=[]
      params[0]=eventId
      params[1]=decoded.userName
      connection.query(sqlObj.checkInvitationStatus,params,function(err,result){
        if(err){
          res.render("error")
        }
        else{
          if(result.length==0){
            return res.json({
              code:1
            })
          }
          else{
            return res.json({
              code:200
            })
          }
          
        }
      })
    }
  })
})
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
              console.log(result.insertId);
              // console.log(req.body.hashTags);
              var hashTags=req.body.hashTags.split("#")
              for(var i=0;i<hashTags.length;i++){
                if(hashTags[i]){
                params=[]
                params[0]=result.insertId
                params[1]=hashTags[i]
                sync_connection.query(sqlObj.addHashtag,params)
                }
              }
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
router.post("/group",function(req,res,next){
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
          params[0]=req.body.name
          params[1]=decoded.userName
          params[2]=req.body.description
          params[3]=req.body.imgPath
          params[4]=req.body.category
          connection.query(sqlObj.insertGroup,params,function(err,result){
            if(err){
                console.log(err)
                throw err
            }
            else{
                return res.json({
                    code: 200,
                    message: '添加group成功'
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
router.get('/event/:eventId/invitation',authenticationCheck,function(req, res, next) {
  res.render("./event/event_invitation")
});
router.get('/event/:eventId/invited',authenticationCheck,function(req, res, next) {
  connection.query(sqlObj.getInvitedList,req.params.eventId,function(err,result){
    if(err){
      console.log(err)
      throw err
    }
    else{
      res.render("./event/event_invited",{list:result})
    }
  })
  
});
router.post('/event/:eventId/invitation',authenticationCheck,function(req, res, next) {
  var userName=req.body.userName
  params=[]
  params[0]=req.params.eventId
  params[1]=userName
  connection.query(sqlObj.inviteSomeone,params,function(err,result){
    if(err){
      return res.json({
        code: 1,
        message: 'failed'
      })
    }
    else{
      return res.json({
        code: 200,
        message: 'success'
      })
    }
  })
});
router.post('/event/:eventId/uninvitation',authenticationCheck,function(req, res, next) {
  var userName=req.body.userName
  params=[]
  params[0]=req.params.eventId
  params[1]=userName
  connection.query(sqlObj.unInviteSomeone,params,function(err,result){
    if(err){
      return res.json({
        code: 1,
        message: 'failed'
      })
    }
    else{
      return res.json({
        code: 200,
        message: 'success'
      })
    }
  })
});
router.post('/group/:groupId/invitation',authenticationCheck,function(req, res, next) {
  var userName=req.body.userName
  params=[]
  params[0]=req.params.groupId
  params[1]=userName
  connection.query(sqlObj.inviteSomeoneGroup,params,function(err,result){
    if(err){
      return res.json({
        code: 1,
        message: 'failed'
      })
    }
    else{
      return res.json({
        code: 200,
        message: 'success'
      })
    }
  })
});
router.post('/group/:groupId/approve',authenticationCheck,function(req, res, next) {
  var userName=req.body.userName
  params=[]
  params[0]=req.params.groupId
  params[1]=userName
  connection.query(sqlObj.inviteSomeoneGroup,params,function(err,result){
    if(err){
      return res.json({
        code: 1,
        message: 'failed'
      })
    }
    else{
      connection.query(sqlObj.deleteRequest,params,function(err,result){
        return res.json({
          code: 200,
          message: 'success'
        })
      })
      
    }
  })
});
router.post('/group/:groupId/uninvitation',authenticationCheck,function(req, res, next) {
  var userName=req.body.userName
  params=[]
  params[0]=req.params.groupId
  params[1]=userName
  connection.query(sqlObj.unInviteSomeoneGroup,params,function(err,result){
    if(err){
      return res.json({
        code: 1,
        message: 'failed'
      })
    }
    else{
      return res.json({
        code: 200,
        message: 'success'
      })
    }
  })
});
router.post('/group/:groupId/join_request',authenticationCheck,function(req, res, next) {
  jwt.verify(req.cookies.token, 'shhhhh', function(err, decoded) {
  var userName=decoded.userName
  params=[]
  params[0]=req.params.groupId
  params[1]=userName
  connection.query(sqlObj.requestToJoin,params,function(err,result){
    if(err){
      return res.json({
        code: 1,
        message: 'failed'
      })
    }
    else{
      return res.json({
        code: 200,
        message: 'success'
      })
    }
  })
})
});
router.post('/people/invitation',authenticationCheck,function(req, res, next) {
  var invited=[]
  var eventId=req.body.eventId
  var string=req.body.string+'%'
  connection.query(sqlObj.searchPeople,string,function(err,result){
    if(err){
      console.log(err)
      throw err
    }
    else{ 
        for(var i=0;i<result.length;i++){
          params=[]
          params[0]=eventId
          params[1]=result[i].userName
          const outcome=sync_connection.query(sqlObj.checkInvitationStatus,params)
          if(outcome.length==0){
            invited.push(false)
          }
          else{
            invited.push(true)
          }

        }
        console.log(result,invited)
        res.render("event/event_peopleSearch.jade",{list:result,invited:invited})
      
    }
  })
});
router.get('/event/:eventId/invited',authenticationCheck,function(req, res, next) {
  res.render("./event/event_invited")
});
module.exports = router;
