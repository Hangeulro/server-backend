var express = require('express');
var router = express.Router();
var rndString = require("randomstring");
var Q = require('q');
var multer = require('multer');
var moment = require('moment');

var date = moment().format();


var upload = function (req, res, boardid) {
    var deferred = Q.defer();
    var storage = multer.diskStorage({
        // 서버에 저장할 폴더
        destination: function (req, file, cb) {
            cb(null, "upload/");
        },

        // 서버에 저장할 파일 명
        filename: function (req, file, cb) {
            file.uploadedFile = {
                name: boardid,
                ext: file.mimetype.split('/')[1]
            };

            cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
        }
    });

    var upload = multer({ storage: storage }).single('file');
    upload(req, res, function (err) {
        if (err) {
            deferred.reject();
        }else if(req.file === undefined){
            var title = req.body.title;
            var token = req.body.token;
            var contents = req.body.contents;

            Users.findOne({token: token}, function(err, result) {
                if (err) return res.status(409).send("DB error");
                else if(result == null) return res.status(400).send("not valid token");
                var current = new Boards({
                    boardid: boardid,
                    title: title,
                    writer: result.name,
                    writerToken: token,
                    writer_profile: result.profile_image,
                    date: date,
                    contents: contents,
                });

                current.save(function(err, data) {
                    if (err) return res.status(409).send("DB error");
                    return res.status(200).send("success");
                });
            });
        }else{
            deferred.resolve(req.file.uploadedFile);
        }
    });
    return deferred.promise;
};

router.post('/write', function(req, res, next) {
    var boardid = rndString.generate();

    upload(req, res, boardid).then(function (file) {
        var title = req.body.title.replace(/\"/gi, "");
        var token = req.body.token.replace(/\"/gi, "");
        var contents = req.body.contents.replace(/\"/gi, "");

        var image = "upload/"+file.name+"."+file.ext;
        var url = file.name+"."+file.ext;


        Users.findOne({token: token}, function(err, result) {
            if (err) return res.status(409).send("DB error");
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
                if (err) return res.status(409).send("DB error");
                return res.status(200).send("success");
            });
        });

    }, function (err) {
        if(err) return res.status(409).send(err);
    });
});



router.post('/', function(req, res) {
    Boards.find({}, function(err, result) {
        if (err) return res.status(409).send("DB error")
        return res.status(200).send(result);
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

      Boards.update({boardid: boardid}, {$push : {comments : {writer: user.name, date: date, summary: summary, profile_image: user.profile_image}}}, function(err, result){
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
