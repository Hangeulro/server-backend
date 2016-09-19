var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res) {
  Words.find({}, function(err, word) {
      if(err) err;
      return res.status(200).send(word);
  });
});


router.post('/find', function(req, res) {
  var sh = req.body.search;
  var data = [];
     console.log(sh);

  Words.find({}, function(err, result){
      if(err){
         return res.status(400).send(err);
         throw err;
      }

     for(var i =0; i<result.length; i++){
       if (result[i].word.indexOf(sh) !== -1) {
          data.push(result[i]);
       }else if(result[i].similar !== null){
        for(var j = 0; j<result[i].similar.length; j++){
          if(result[i].similar[j].indexOf(sh) !== -1){
            data.push(result[i]);
          }
	}
       }
    }

       return res.status(200).send(data);
  });
});


router.post('/cata', function(req, res) {
  var cata = req.body.cata;
  var data = [];

  Words.find({}, function(err, result){
      if(err){
         return res.status(400).send(err);
         throw err;
      }

     for(var i = 0; i<result.length; i++){
       if(result[i].cata !== null){
        for(var j = 0; j<result[i].cata.length; j++){
          if(result[i].cata[j].indexOf(cata) !== -1){
            data.push(result[i]);
            }
          }
        }
     }

       return res.status(200).send(data);
  });
});

router.post('/getWordInfo', function(req, res){
  var wordId = req.body.wordid  

  Words.findOne({'id': wordId}, function (err, result) {
   if (err) return err;
   if(result.see === undefined){
       Words.update({id: result.id+""}, {$set : {see: 1}}, function(err, result){
            if(err) err;
       });
            return res.status(200).send(result);
    }else{
        var up = result.see;
        up++;
        Words.update({id: result.id+""}, {$set : {see: up}}, function(err, result){
            if(err) err;
        });
            return res.status(200).send(result);
    }
  })  
});

module.exports = router;
