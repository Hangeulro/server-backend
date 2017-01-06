var express = require('express');
var router = express.Router();
var moment = require('moment-timezone');
moment().tz("America/Los_Angeles").format();

router.get('/', function(req,res){
    var dt = new Date();
    var today = moment().tz("Asia/Seoul").format("YYYY MM DD");

    TodayWords.findOne({day: today}, function(err, result){
         if(err) return res.status(409).send("DB Error");

         if(result) {
             Words.findOne({id: result.wordid}, function(err, word) {
                 if(err) return res.status(409).send("DB Error");
                 return res.status(200).send(word);
             });
         }else{
             var rand = Math.floor(Math.random()*998)+"";
             Words.findOne({id: rand}, function(err, word) {
                 if(err) return res.status(409).send("DB Error");

                 var current = new TodayWords({
                     day: today,
                     wordid: word.id
                 });

                 current.save(function(err, data) {
                     if (err) return res.status(409).send("DB error");
                     return res.status(200).send(word);
                 });
             })
         }

    });
});


module.exports = router;
