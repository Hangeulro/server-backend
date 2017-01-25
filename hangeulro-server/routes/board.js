module.exports = (router, moment, rndString, func) =>{

  router.post('/write', function(req, res, next) {
    var boardid = rndString.generate();
    var date = moment().tz("Asia/Seoul").format();
    var params = ['title', 'token', 'contents'];

    func.upload(req, res, boardid, date, params, rndString).then(function (file) {
      var title = req.body.title.replace(/\"/gi, "");
      var token = req.body.token.replace(/\"/gi, "");
      var contents = req.body.contents.replace(/\"/gi, "");

      var image = "upload/"+file.name+"."+file.ext;
      var url = file.name+"."+file.ext;

      Users.findOne({token: token}, function(err, result) {
          if (err) return res.status(500).send("DB error");
          else if(result == null) return res.status(400).send("not valid token");
          var current = new Boards({
            boardid: boardid,
            title: title,
            writer: result.name,
            writerToken: token,
            writer_profile: result.profile_image,
            date: date,
            contents: contents,
            imageurl: "http://iwin247.net/image/"+url
          });

          current.save(function(err, data) {
              if (err) return res.status(500).send("DB error");
              return res.status(200).send("success");
          });
      });
    }, function (err) {
      if(err) return res.status(409).send(err);
    });
  })

  .get('/board', (req, res) =>{
     Boards.find({}, function(err, result) {
       if (err) return res.status(409).send("DB error")
       return res.status(200).send(result);
     });
  })

  .post('/comment', function(req, res){
    var params = ['token', 'boardid', 'summary', 'date'];
    func.check_param(req.body, params, res);
    var token = req.body.token;
    var boardid = req.body.boardid;
    var summary = req.body.summary;
    var date = req.body.date;

    Users.findOne({token: token}, function(err, user) {
      if (err) return res.status(500).send("DB error");
      else if(!user) return res.status(401).send("not valid token");
        Boards.update({boardid: boardid}, {$push : {comments : {writer: user.name, date: date, summary: summary, profile_image: user.profile_image}}}, function(err, result){
          if(err) return res.status(500).send("DB Error");
          if(result.ok){
            Boards.findOne({boardid: boardid}, function(err, board){
              res.status(200).send(board);
            });
          }else res.status(404).send("nothing changed");
      });
    });
  })

  .put('/like', function(req, res) {
    var params = ['token', 'boardid'];
    func.check_param(req.body, params, res);

    var boardid = req.body.boardid;
    var token = req.body.token;

    Boards.findOne({boardid: boardid}, function(err, result) {
      if(err) return res.status(409).send("db eror");

      if(result !== null){
        var good = result.good;

        Boards.update({boardid: boardid}, {$set : {good: ++good}}, function(err, result){
          if(err) return res.status(409).send("DB error");
          Boards.findOne({boardid: boardid}, function(err, board){
            if(err) return res.status(409).send("DB error");
            res.status(200).send(board);
	  });
        });
      }else return res.status(409).send("board not found");
    });
  })

  .put('/dislike', function(req, res) {
    var params = ['token', 'boardid'];
    func.check_param(req.body, params, res);

    var boardid = req.body.boardid;

    Boards.findOne({boardid: boardid}, function(err, result) {
      if(result){
        var bad = result.bad;
        Boards.update({boardid: boardid}, {$set : {bad: ++bad}}, function(err, result){
          Boards.findOne({boardid: boardid}, function(err, board) {
            if(err) res.status(409).send("DB error");
            res.status(200).send(board);
          });
        });
      }else return res.status(409).send("board not found");
   });
  })

  .get('/board/:boardid', function(req, res){
    console.log(req.params);
    var params = ['boardid'];
    func.check_param(req.params, params, res);
    var boardid = req.params.boardid;

    Boards.findOne({boardid: boardid}, {_id:0, writerToken:0}, function(err, board){
      if(err) return res.status(5000).send("DB Error");
      if(board) return res.status(200).send(board);
      else return res.status(404).send("board not found");
    });
  })

  .delete('/destroy', function(req, res){
    var boardid = req.body.boardid;

    Boards.remove({boardid: boardid}, function(err, board){
      if(err)  return res.status(500).sned("DB ERROR");
      if(board)  return res.status(200).send("good removed");
      else  return res.status(404).send("board not found")
    });
  })

  .put('/edit', function(req, res){
    var params = ['boardid'];
    func.check_param(req.params, params, res);
    var title = req.body.title;
    var boardid = req.body.boardid;
    var contents = req.body.contents;
    var date = moment().tz("Asia/Seoul").format();
  
    Boards.update({boardid: boardid}, {$set: {title: title, contents: contents, date: date}}, (err, board)=>{
      if(err) return res.status(500).sned("DB ERROR");
      if(result)  return res.status(200).send("changed");
      else  return res.status(401).send("not found")
    });
  });

  return router;
}
