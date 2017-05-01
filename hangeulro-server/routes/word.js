module.exports = (router, func) => {
  router.get('/word', (req, res) =>{
    Words.find({}, function(err, word) {
      if(err) return res.status(500).send(err);
      if(word) return res.status(200).send(word);
    });
  })

  .post('/find', (req, res)=>{
    var sh = req.body.search;
    var data = [];

    Words.find({$or: [{word: { $regex: sh }}, {cata: {$elemMatch: { $regex: sh }}}, {similar: {$elemMatch: { $regex: sh }}}]}, (err, words)=>{
      if(err){
         return res.status(400).send(err);
         throw err;
      }
      return words.length > 0 ? res.status(200).send(words):res.status(404).send("DB에 없거나 잘못검색하셨습니다");
    });
  })

  .get('/cata/:cata', (req, res)=>{
    var cata = req.params.cata;
    var data = [];

    Words.find({cata: {$elemMatch: { $regex: cata }}} , (err, catas)=>{
      if(err){
         return res.status(400).send(err);
         throw err;
      }
      return catas.length > 0 ? res.status(200).send(catas):res.status(404).send("DB에 없거나 잘못검색하셨습니다");
    });
  })

  //더이상 사용되지않음
  .post('/comment', (req, res)=>{
    var params = ['token', 'date', 'id', 'summary'];
    if(!func.check_param(req.bdoy, params, token)){
      res.status(400).send("param missing");
    }
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

  .get('/word/:wordid', function(req, res){
    var params = ['wordid'];
    if(!func.check_param(req.params, params)){
      res.status(400).send("param missing");
    }
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

        return res.status(200).json([result]);
      }
    });
  });

  return router;
}
