var express = require('express');
var router = express.Router();
var rndString = require("randomstring");

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', function(req, res, next){
   if(req.query.userid === '' || req.query.password === '' || req.query.username === ''){
      return res.status(403).send("Params Missing");
   }else{
      var current = new Users({
                id: req.query.userid,
                pw: req.query.password,
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
             return res.status(200).send("success");
          }
      });
   }
});


router.post('/login', function(req, res, next){
   Users.findOne({id: req.query.userid}, function (err, user){
     if(user != null){
       if(user.id){
       }
       var obj = {
   	"id": user.id, 
        "token": user.token
       };
       return res.status(200).send(obj);
       console.log('user Login');
     }else{
       return res.status(400).send("no user");
     }
   });
});

module.exports = router;
