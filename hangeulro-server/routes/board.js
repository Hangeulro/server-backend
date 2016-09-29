var express = require('express');
var router = express.Router();
var upload = require('./module/upload');
var rndString = require("randomstring");
var gm = require('gm');

router.post('/', function(req, res) {
    Boards.find({}, function(err, result) {
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

    Users.findOne({token: token}, function(err, result) {
        if (err) return res.status(409).send("DB error");
        else if(result == null) return res.status(400).send("not valid token");

        if(req.file != undefined){
          upload.upload(req, res, boardid).then(function(file) {
            var image = "upload/"+file.name+"."+file.ext;

            gm(image).resize(300, 300).write(image, function (err) {
              if (err) console.error(err);
              else console.log('done');
            });
                  var current = new Boards({
                      boardid: boardid,
                      title: title,
                      writer: result.name,
                      writerToken: token,
                      date: Date,
                      contents: contents,
                      imageurl: "http://iwin247.net/image/"+image
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
            writer: result.name,
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

  Users.findOne({token: token}, function(err, user) {
      if (err) return res.status(409).send("DB error");
      else if(user == null) return res.status(400).send("not valid token");

      Boards.update({boardid: boardid}, {$push : {comments : {writer: user.name, date: date, summary: summary}}}, function(err, result){
          if(err) return res.status(409).send("DB Error");
          if(result.ok > 0){
            Boards.findOne({boardid: boardid}, function(err, board){
              res.status(200).send(board);
            });
          }else{
            res.status(300).send("nothing chenged");
          }
      });
  });
});

router.post('/like', function(req, res) {
   var boardid = req.body.boardid;

   Boards.findOne({boardid: boardid}, function(err, result) {
     if(err) return res.status(409).send("db eror");

     if(result !== null){
       var good = result.good;
       Boards.update({boardid: boardid}, {$set : {good: ++good}}, function(err, result){
         if(err) return res.status(409).send("DB error");
         Boards.findOne({boardid: boardid}, function(err, board){
           if(err) return res.status(409).send("DB error");
           res.status(200).send(board);
	 })
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
      Boards.update({boardid: boardid}, {$set : {bad: ++bad}}, function(err, result){
          Boards.findOne({boardid: boardid}, function(err, board) {
             if(err) res.status(409).send("DB error");
             res.status(200).send(board);
          });
      });
   }else{
     return res.status(409).send("board not found");
   }
 });
});

router.post('/detail', function(req, res){
   var boardid = req.body.boardid;

   Boards.findOne({boardid: boardid}, {_id:0, writerToken:0}, function(err, result){
     if(err) return res.status(409).send("DB Error");
     if(result){
       return res.status(200).send(result);
     }
   });
});

module.exports = router;
