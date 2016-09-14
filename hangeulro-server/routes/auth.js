var express = require('express');
var router = express.Router();
var rndString = require("randomstring");

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', function(req, res, next){
   if(req.query.userid === undefined || req.query.pw === undefined || req.query.username === undefined || req.query.userid === '' || req.query.pw === '' ||  req.query.username === ''){
      return res.status(403).send("Params Missing");
   }else{
      var current = new Users({
                userid: req.query.userid,
                pw: req.query.pw,
                username: req.query.username,
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
   Users.findOne({userid: req.query.userid}, function (err, user){
     if(user != null){
       if(user.userid === req.query.userid && user.pw === req.query.pw){
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
	Users.findOne({token: req.query.token}, function (err, resul){
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
