var express = require('express');
var router = express.Router();
var rndString = require("randomstring");

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', function(req, res, next){
   if(req.body.userid === undefined || req.body.pw === undefined || req.body.username === undefined || req.body.userid === '' || req.body.pw === '' ||  req.body.username === ''){
      return res.status(403).send("Params Missing");
   }else{
      var current = new Users({
                userid: req.body.userid,
                pw: req.body.pw,
                username: req.body.username,
	        token: rndString.generate()
      });
      current.save(function(err, data) {
          if (err) { // TODO handle the error
 	     if(err.errmsg.indexOf("dup") !== -1){
              return res.status(300).send("already exists");
             }else{
              return res.status(400).send("DB Error");
             }
          }else{ 
             return res.status(200).send(current);
          }
      });
   }
});


router.post('/login', function(req, res, next){
   Users.findOne({userid: req.body.userid}, function (err, user){
     if(user != null){
       if(user.userid === req.body.userid && user.pw === req.body.pw){
         var obj = {
   	      "userid": user.userid, 
          "token": user.token
         };
        return res.status(200).send(obj);
	   }else{
        return res.status(401).send("login incorrect");
	   }

     }else{
       return res.status(400).send("no user");
     }
   });
});

router.post('/auto', function(req, res, next){
	Users.findOne({token: req.body.token}, function (err, resul){
	  if(resul != null){
	     var obj = {
	         "userid": resul.userid,
	         "token": resul.token
	      };
		  return res.status(200).send(obj);
	  }else{
	    return res.status(401).send("Access Denied");
	  }
	});
});
module.exports = router;
