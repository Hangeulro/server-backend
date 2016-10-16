var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
    Words.find({$query: {}, $orderby: { see : 1 }}, function(err, word) {
      if(err) err;
      return res.status(200).send(word);
  });
});


router.post('/find', function(req, res) {
  var sh = req.body.search;
  var data = [];

    Words.find({$query: {}, $orderby: { see : 1 }}, function(err, result){
      if(err){
         return res.status(400).send(err);
         throw err;
      }

     for(var i = 0; i<result.length; i++){
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

  Words.find({$query: {}, $orderby: { see : 1 }} , function(err, result){
      if(err){
         return res.status(400).send(err);
         throw err;
      }

     for(var i = 0; i<result.length; i++){
       if(result[i].cata == null && cata === '일'){
          data.push(result[i]);
       }else if(result[i].cata !== null){
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

router.post('/commentAdd', function(req, res){
  var token = req.body.token;
  var date = req.body.date+"";
  var id = req.body.wordid+"";
  var summary = req.body.summary+"";
  Users.findOne({token: token}, function(err, user){
    if(err) return res.status(401).send("user not found");

    Words.update({id : id}, {$push : {comments : {writer: user.name, date: date, summary: summary, profile_image: user.profile_image}}}, function(err, result){
        if(err) return res.status(409).send("DB Error");

        if(result.ok > 0){
          Words.findOne({id: id}, function(err, word){
            res.status(200).send(word);
          });
        }else{
          res.status(300).send("nothing chenged");
        }
    });
  });
})

router.post('/getWordInfo', function(req, res){
  var wordId = req.body.wordid+"";
  var data;

  Words.findOne({id: wordId}, function (err, result) {

    if (err) return err;
    if(result){
        var up = result.see;
        var id = result.id+"";
        up++;

        Words.update({id: id}, {$set : {see: up}}, function(err, word){
            if(err) err;
        });

        Words.find({id: id}, function(err, result){
          if(err) err;
          return res.status(200).send(result);
        });

    }

  });
});

module.exports = router;
