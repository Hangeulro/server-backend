module.exports = (router, func) => {
  router.get('/my/:token', function(req, res) {
    var params = ['token'];
    if(!func.check_param(req.bdoy, params, token)){
      res.status(400).send("param missing");
    }

    var token = req.param.token;

    Users.findOne({token: token},{_id: 0 , userid: 0, token:0} ,function(err, user){
      if(err) return res.status(500).send("DB Error");
      if(user) return res.status(200).send(user);
      else  return res.status(401).send("vaild token");
    });
  })

  .put('/pointUp', function(req, res) {
    var params = ['token', 'pointUp'];
    if(!func.check_param(req.bdoy, params, token)){
      res.status(400).send("param missing");
    }
    
    var token = req.body.token;
    var pointUp = Number(req.body.pointUp);

    Users.findOne({token: token}, function(err, result){
      if(err) return res.status(500).send("DB error");
      if(result){
        if(result.point + pointUp < result.max_point){
          Users.update({token : token}, {$set : {point : result.point + pointUp, total_point: result.total_point+pointUp}}, function(err, resul){
            if(err) return res.status(500).send("DB Error");
            if(resul.ok > 0){
              Users.findOne({token: token}, function(err, user){
                if(err) return res.status(500).send("DB ERROR");
                if(user) return res.status(200).send(user);
                else return res.status(404).send("user not found");
              });
            }else return  res.status(412).send("nothing chenged");
          });
        }else{ 
          var point = Number(result.point) + pointUp;
	  var next = point - result.max_point;
          var level = result.level+1;

	  Users.update({token : token}, {$set : {point : next, level: level, max_point: result.max_point + 500, total_point: result.total_point+pointUp}}, function(err, resul){
            if(err) return res.status(410).send(err);
            if(resul.ok > 0){
              Users.findOne({token: token}, function(err, user){
                if(err) return res.status(500).send("DB ERROR");
                if(user) return res.status(200).send(user);
                else return res.status(401).send("user not found");
              });
            }else return  res.status(412).send("nothing chenged");
          });
        }
      }else return res.status(404).send("user not found");
    });
  })


  .get('/board', (req, res) =>{
    var params = ['token'];
    if(!func.check_param(req.bdoy, params, token)){
      res.status(400).send("param missing");
    }

    var token = req.body.token;

    Users.findOne({token: token}, function(err, user) {
      if(err) return res.status(500).send("DB Error");

      if(user){
        Boards.find({writer: result.name}, function(err, board){
          if(err) return res.status(500).send("DB Error");
          if(board) return res.status(200).send(board);
          else return res.status(404).send("ever written");
        });
      }else return res.status(401).send("vaild token");
    });
  })

  .put('/edit', function(req, res){
    var params = ['token','newName'];
    if(!func.check_param(req.bdoy, params, token)){
      res.status(400).send("param missing");
    }

    func.profile_upload(req, res).then(function (file) {
      var token = req.body.token;
      var newName = req.body.newName;

      if(newName){
        Users.update({token: token}, {$set: {profile_image: "http://iwin247.net/image/users/"+token, name: newName}}, function(err, result){
          if(err) res.sendSatus(500);
          if(result) res.status(200).send("changed");
        });
      }else{
        Users.update({token: token}, {$set: {profile_image: "http://iwin247.net/image/users/"+token}}, function(err, result){
          if(err) res.sendSatus(500);
          if(result) res.status(200).send("changed");
        });
      }
    }, function (err) {
      if(err) return res.status(500).send(err);
    });
  });

  return router;
}
