var express = require('express');
var router = express.Router();
var upload = require('./module/upload');
var rndString = require("randomstring");

router.get('/', function(req, res) {
    res.send("nope");
});

router.post('/', function(req, res) {
    Comments.find({}, function(err, result) {
        if (err) return res.status(409).send("DB error")
        return res.status(200).send(result);
    });
});

router.post('/write', function(req, res) {
    var boardid = rndString.generate();
    var title = req.body.title;
    var token = req.body.token;
    var Date = req.body.date;
    var contents = req.body.contents;

    console.log(token);

    Users.findOne({token: token}, function(err, result) {
        if (err) return res.status(409).send("DB error");
        else if(result == null) return res.status(400).send("not valid token");


        if(req.file != undefined){
          upload.upload(req, res, boardid).then(function(file) {
                  var current = new Boards({
                      boardid: boardid,
                      title: title,
                      writer: result.username,
                      writerToken: token,
                      date: Date,
                      contents: contents,
                      imageurl: "http://iwin247.net/image/"+file.name+"."+file.ext
                  });

                  current.save(function(err, data) {
                      if (err) return res.status(409).send("DB error");
                      return res.status(200).send("success");
                  });
          }, function(err) {
              return res.status(500).send("image upload error");
          });

      }else{
        var current = new Boards({
            boardid: boardid,
            title: title,
            writer: result.username,
            writerToken: token,
            date: Date,
            contents: contents,
        });

        current.save(function(err, data) {
            if (err) return res.status(409).send("DB error");
            return res.status(200).send("success");
        });
      }
    });
});

router.post('/commentAdd', function(req, res){
  var token = req.body.token;
  var boardid = req.body.boardid;
  var summary = req.body.summary;
  var date = req.body.date;

  Users.findOne({token: token}, function(err, result) {
      if (err) return res.status(409).send("DB error");
      else if(result == null) return res.status(400).send("not valid token");

      var current = new Comments({
          boardid: boardid,
          writer: result.username,
          date: date,
          summary: summary,
      });

      current.save(function(err, data) {
          if (err) return res.status(409).send("DB error");
          return res.status(200).send("success");
      });
  });
});

router.post('/like', function(req, res) {
   var boardid = req.body.boardid;

   Boards.findOne({boardid: boardid}, function(err, result) {
     if(result !== null){
       var good = result.good;
       Boards.update({boardid: boardid}, {$set : {good: ++good}}, function(err, result){
         if(err) return res.status(409).send("DB error");
       });
    }else{
      return res.status(409).send("board not found");
    }
  });
});

router.post('/dislike', function(req, res) {
  var boardid = req.body.boardid;

  Boards.findOne({boardid: boardid}, function(err, result) {
   if(result !== null){
      var bad = result.bad;
      Boards.update({boardid: boardid}, {$set : {bad: --bad}}, function(err, result){
        if(err) return res.status(409).send("DB error");
      });
   }else{
     return res.status(409).send("board not found");
   }
 });
});

router.post('/my', function(req, res) {
   var token = req.body.token;

   Users.findOne({token: token}, function(err, result) {
     if(err) return res.status(409).send("DB Error");

     if(result !== null){
       Boards.find({writer: result.username}, function(err, result){
         if(err) return res.status(409).send("DB Error");

         if(result !== null) return res.status(200).send(result);
         else return res.status(201).send("ever written");
       });
    }
   });
});

module.exports = router;