var express = require('express');
var router = express.Router();
var rndString = require("randomstring");


router.post('/make', function(req, res, next){
    var dicname = req.body.dicname;
    var token = req.body.token;
    
    var current = new Users({
        owner: token,
        dicname: req.body.passwd
    });
     
    current.save(function(err, data) {
       if (err) { // TODO handle the error
         res.status(409).send('DB error');
       }
    });
    
});


router.post('/add', function(req, res, next){
   var dicname = req.body.dicname;
   var token = req.body.token;
   var id = req.body.id;

   Mydics.update({token: token, dicname: dicname}, {$push: {favorite: id}}, function(err, result){
       if(err) err;
       res.send('ads');
   });
});

router.post('/pop', function(req, res, next){
    var token = req.body.token;
    var dicname = req.body.dicname;
    var faver;
});

module.exports = router;
