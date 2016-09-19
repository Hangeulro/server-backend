var express = require('express');
var router = express.Router();
var rndString = require("randomstring");


router.post('/make', function(req, res, next){
    var dicname = req.body.dicname;
    var token = req.body.token;
    
    Users.findOne({token: token} function(err, result){
       
    });
    
});


router.post('/make', function(req, res, next){
    var dicname = req.body.dicname;
    var token = req.body.token;
    
    
});


module.exports = router;
