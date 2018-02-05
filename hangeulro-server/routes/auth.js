module.exports = (router, rndString, passport, func, Users) =>{
  router.post('/register', function(req, res, next) {
    var params = ['userid', 'pw', 'name'];

    if(!func.check_param(req.body, params)) return res.status(400).send("param missing"); 
    console.log(req.body);
    var current = new Users({
      userid: req.body.userid,
      name: req.body.name,
      pw: req.body.pw,
      token: rndString.generate()
    });

    current.save(function(err, data) {
      if (err) { // TODO handle the error
        console.log(err);
        return res.status(500).send("DB Error");
      } else {
        return res.status(200).send(current);
      }
   });
  })

  .post('/login', function(req, res, next) {
    var params = ['userid', 'pw'];
    if(!func.check_param(req.body, params, res)){
      return res.status(400).send("param missing");
    }

    Users.findOne({ userid: req.body.userid, pw: req.body.pw}, function(err, user) {
      if (user) 
        return res.status(200).json({userid: user.userid, name: user.name, token: user.token});
      else
        return res.status(401).send("connot login");
   });
 })

  .post('/auto', function(req, res, next) {
    var params = ['token'];
    if(!func.check_param(req.body, params, params)){
      return res.status(400).send("param missing");
    }

    Users.findOne({token: req.body.token}, function(err, users) {
      console.log(users);
      if(err) return res.status(500).sned(err);
      if (users) return res.status(200).send(users);
      else return res.status(401).send("Un Auth");
    });

  })

  .get('/fb/token', passport.authenticate('facebook-token'), function(req, res) {
    if (req.user) {
      Users.findOne({userid: req.user.userid}, function(err, users) {
        if(err) err;
        if(users) res.status(200).send(users);
        else res.status(401).send("not found");
      });
    } else if (!req.user) {
        res.send(401, req.user);
    }
  })

  .get('/tw/token', passport.authenticate('twitter-token'), function(req, res) {
    if(req.user) {
      Users.findOne({userid: req.user.id}, function(err, result) {
        if(err) err;
        res.send(200, result);
      });
    } else if (!req.user) {
      res.send(401, req.user);
    }
  })

  //callback
  .get('/fb/callback', passport.authenticate('facebook-token', {
    successRedirect: '/',
    failureRedirect: '/'
  }))

  .delete('/destroy/:token', function(req, res){
    var params = ['token'];
    if(!func.check_param(req.params, params)){
      res.status(400).send("param missing");
    }

    Users.remove({token: req.params.token}, function(err, users){
      if(err) return res.status(500).sned("DB ERROR");
      if(users) return res.status(200).send("good bye");
      else return res.status(404).send("user not found")
    });
  })

  return router;
}
