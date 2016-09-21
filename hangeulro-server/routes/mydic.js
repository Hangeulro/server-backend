var express = require('express');
var router = express.Router();

router.post('/make', function(req, res, next){
    var dicname = req.body.dicname+"";
    var sub = req.body.sub+""
    var token = req.body.token+"";

     Mydics.findOne({owner: token, dicname: dicname}, function(err, result){
       if(err) return res.status(409).send("DB ERROR");
       console.log(result)
       if(result !== null){
          return res.status(409).send("already exists");
       }else{
 
         var current = new Mydics({
           owner: token,
           dicname: dicname,
           sub: sub,
           favorite: []
         });

          current.save(function(err, data) {
            if (err) return res.status(409).send("DB error");
            return res.status(200).send('success');
         });

      } 
    });
    
});


router.post('/add', function(req, res, next){
   var dicname = req.body.dicname;
   var token = req.body.token;
   var id = req.body.id;
   
   
    Mydics.findOne({owner: token, dicname: dicname}, function(err, result){
       if(err) return res.status(409).send("DB ERROR");
        
       if(result.favorite !== undefined){
         for(var i = 0; i<result.favorite.length; i++){
           if(result.favorite[i] === id){
             return res.status(409).send("already exists");
             break;
           }
         }
       }

       Mydics.update({owner: token, dicname: dicname}, {$push: {favorite: id}}, function(err, com){
         if(err) err;
         res.status(200).send("success");
       });
        
    });
});

router.post('/pop', function(req, res, next){
    var token = req.body.token;
    var dicname = req.body.dicname;
    var id = req.body.id;
    
    Mydics.update({owner: token, dicname: dicname}, {$pop: {favorite: id}}, function(err, result){
       if(err) err;
       res.status(200).send("success");
    });
});

router.post('/', function(req, res){
   var token = req.body.token;
   Mydics.find({owner: token}, function(err, result){
       if(result !== null){
	 return res.status(404).send("No dic");
       }else{
         return res.status(200).send(result);
       }
   });
});

module.exports = router;
