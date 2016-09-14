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
  var sh = req.query.search;
  var data = [];
     console.log(sh);

  Words.find({}, function(err, result){
      if(err){
       return res.send(400, "Failed");
         throw err;
      }

     for(var i =0; i<result.length; i++){
       if (result[i].word.indexOf(sh) !== -1) {
          data.push(result[i]);
       }else{
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


module.exports = router;
