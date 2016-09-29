var express = require('express');
var router = express.Router();

router.post('/', function(req, res){
  var quize = [];
  var aryQuize = [];
  var idx = 0;
  var data = [];

   //46 숫자 저장
   for (var i = 1; i < 999; i++){
       aryQuize.push(i);
   }

   while (quize.length < 10){
       idx = Math.floor(Math.random()*aryQuize.length);
       quize.push(aryQuize[idx]);
       aryQuize.splice(idx,1);
   }

     Words.find({}, function(err, result){
        if(err) err;

        if(result){
          for(var i = 0; i<quize.length; i++){
            data.push(result[quize[i]]);
          }
          return res.status(200).send(data);
        }
     });
});


module.exports = router;
