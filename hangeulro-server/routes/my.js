var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  var token = req.body.token;

  Users.findOne({token: token},{_id: 0 , userid: 0, token:0} ,function(err, user){
    if(err) return res.status(409).send("DB Error");
    if(user){
      return res.status(200).send(user);
    }else{
      return res.status(401).send("User not found");
    }
  });
});

router.post('/pointUp', function(req, res) {
  var token = req.body.token;
  var pointUp = req.body.pointUp;

  Users.findOne({token: token}, function(err, result){
    if(err) return res.status(409).send("DB error");
    if(result){
      if(result.point + Number(pointUp) < result.max_point){
        Users.update({token : token}, {$set : {point : result.point+Number(pointUp)}}, function(err, resul){
            if(err) return res.status(409).send("DB Error");
            if(resul.ok > 0){
                Users.findOne({token: token}, function(err, user){
                  if(err) return res.status(409).send("DB ERROR");
                    if(user){
                    return res.status(200).send(user);
                  }else{
                    return res.status(401).send("user not found");
                  }
                });
            }else{
             return  res.status(300).send("nothing chenged");
            }
        });
      }
    }else{
      return res.status(401).send("user not found");
    }
  });
});


router.post('/board', function(req, res) {
   var token = req.body.token;

   Users.findOne({token: token}, function(err, result) {
     if(err) return res.status(409).send("DB Error");

     if(result !== null){
       Boards.find({writer: result.name}, function(err, result){
         if(err) return res.status(409).send("DB Error");

         if(result !== null) return res.status(200).send(result);
         else return res.status(201).send("ever written");
       });
    }
   });
});

module.exports = router;
