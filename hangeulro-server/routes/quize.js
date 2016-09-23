var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  var quize = [];
  var aryQuize = [];
  var idx = 0;
  var data = "";

   //46 숫자 저장
   for (var i = 1; i < 999; i++){
       aryQuize.push(i);
   }

   while (quize.length < 10){
       idx = Math.floor(Math.random()*aryQuize.length);
       quize.push(aryQuize[idx]);
       aryQuize.splice(idx,1);
   }

   for(var i = 0; i<quize.length; i++){
     Words.findOne({id: quize[i]+""}, function(err, result){
        if(err) err;

        if(result){
          data += result;
        }
     });
     console.log(data);
   }
});


module.exports = router;
