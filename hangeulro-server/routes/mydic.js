module.exports = (router, func)=>{

  router.post('/make', (req, res, next)=>{
    var params = ['dicname', 'sub', 'token'];
    if(!func.check_param(req.bdoy, params, token)){
      res.status(400).send("param missing");
    }

    var dicname = req.body.dicname;
    var sub = req.body.sub;
    var token = req.body.token;

    Mydics.findOne({owner: token, dicname: dicname}, function(err, result){
      if(err) return res.status(500).send("DB ERROR");
      if(result) return res.status(412).send("already exists");
      else{
        var current = new Mydics({
          owner: token,
          dicname: dicname,
          sub: sub,
          favorite: []
        });

        current.save(function(err, data) {
          if (err) return res.status(500).send("DB error");
            Mydics.find({owner: token}, function(err, mydic){
               if(err) res.send(500, "dberror");
               res.status(200).send(mydic);
            });
        });
      }
    });
  })

  .put('/add', function(req, res, next){
    var params = ['dicname', 'token', 'word'];
    if(!func.check_param(req.bdoy, params, token)){
      res.status(400).send("param missing");
    }
    var dicname = req.body.dicname;
    var token = req.body.token;
    var word = req.body.word;
    var check = 0;

    Mydics.findOne({owner: token, dicname: dicname}, function(err, result){
      if(err) return res.status(500).send("DB ERROR");

      if(result.favorite !== undefined && result.favorite !== null){
        Words.findOne({word: word}, function(err, words){
          if(err) return res.status(500).send("Db Error");
             
          for(var i = 0; i<result.favorite.length; i++){
            if(result.favorite[i] === words.id){
                check = 1;
                break;
            }
          }

          if(!check){
            Mydics.update({owner: token, dicname: dicname}, {$push: {favorite: words.id}}, function(err, com){
              if(err) return  res.status(412).send("already exists");

              Mydics.findOne({owner: token, dicname: dicname}, function(err, mydic){
                if(err) res.status(500).send("DB Error");
                return res.status(200).send(mydic);
              });
            });
	   }else return res.status(500).send("error");
         });

       }else{
          Words.findOne({word: word}, function(err, words){
            Mydics.update({owner: token, dicname: dicname}, {$push: {favorite: words.id}}, function(err, com){
               if(err) err;
               Mydics.findOne({owner: token, dicname: dicname}, function(err, mydic){
                  if(err) return res.status(500).send("DB Error");
                  res.status(200).send(mydic);
               });
          });
        });
       }
    });
  })

  .put('/pop', (req, res, next) =>{
    var params = ['dicname', 'token', 'id'];
    if(!func.check_param(req.bdoy, params, token)){
      res.status(400).send("param missing");
    }

    var token = req.body.token;
    var dicname = req.body.dicname;
    var id = req.body.id;

    Mydics.update({owner: token, dicname: dicname}, {$pop: {favorite: id}}, function(err, result){
       if(err) err;
       Mydics.findOne({owner: token, dicname: dicname}, function(err, mydic){
         if(err) res.status(500).send("DB Error");
         res.status(200).send(mydic);
       });
    });
  })
  
  .get('/mydic/:token', (req, res) =>{
    var params = ['token'];
    if(!func.check_param(req.bdoy, params, token)){
      res.status(400).send("param missing");
    }
    var token = req.params.token;

    Mydics.find({owner: token}, function(err, mydic){
      if(mydic) res.status(200).send(mydic);
      else return res.status(500).send("No dic");
    });
  })

  .get('/mydic/:token/:dicname', function(req, res){
    var params = ['token', 'dicname'];
    if(!func.check_param(req.bdoy, params, token)){
      res.status(400).send("param missing");
    }
    var token = req.params.token;
    var dicname = req.params.dicname;
    var data = [];

    Mydics.findOne({owner: token, dicname: dicname}, function(err, mydic){
      if(mydic){
        Words.find({}, function(err, word){
          for(var i = 0; i<mydic.favorite.length; i++){
            for(var j = 0; j<word.length; j++){
              if(mydic.favorite[i] === word[j].id){
                data.push(word[j]);
                break;
              }
            }
          }
          return res.status(200).json({dicname: mydic.dicname, subtxt: mydic.sub, wordlist: data});
        });
      }else return res.status(404).send("No dic");
    });
  });

  return router;
}
