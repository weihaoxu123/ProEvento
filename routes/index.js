var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
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
router.get('/addEvent',function(req, res, next) {
  res.render("addEvent")
});

module.exports = router;
