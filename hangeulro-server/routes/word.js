module.exports = (router) => {

  router.get('/', (req, res) =>{
    Words.find({$query: {}, $orderby: { see : 1 }}, function(err, word) {
      if(err) err;
      return res.status(200).send(word);
    });
  })

  .post('/find', (req, res)=>{
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
  })

  .get('/cata/:cata', (req, res)=>{
    var cata = req.params.cata;
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
  })

  .post('/comment', function(req, res){
    var params = ['token', 'date', 'id', 'summary'];
    func.check_params(req.body, params, res);
    var token = req.body.token;
    var date = req.body.date+"";
    var id = req.body.wordid+"";
    var summary = req.body.summary+"";

    Users.findOne({token: token}, function(err, user){
      if(err) return res.status(401).send("vaild token");

      Words.update({id : id}, {$push : {comments : {writer: user.name, date: date, summary: summary, profile_image: user.profile_image}}}, function(err, result){
        if(err) return res.status(500).send("DB Error");

        if(result.ok > 0){
          Words.findOne({id: id}, function(err, word){
            res.status(200).send(word);
          });
        }else{
          res.status(412).send("nothing chenged");
        }
      });
    });
  })

  .get('/:wordid', function(req, res){
    var params = ['wordid'];
    func.check_params(req.params, params, res);
    var wordId = req.params.wordid+"";
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

  return router;
}
