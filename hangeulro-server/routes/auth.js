var FacebookTokenStrategy = require('passport-facebook-token');
var TwitterTokenStrategy = require('passport-twitter-token');

module.exports = (router, rndString, passport) =>{
  passport.use(new FacebookTokenStrategy({
    clientID: "1213122912074048",
    clientSecret: "259b6ddcb09ade12157f47f4fb2d5c95",
    profileFields: ['id', 'displayName', 'photos'],
  }, function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    Users.findOne({'userid': profile.id}, function(err, user) {
      if(err){
         return done(err);
      }
      if(!user) {
        user = new Users({
          userid: profile.id,
          name: profile.displayName,
          profile_image: profile.photos[0].value,
          token: rndString.generate()
        });

        user.save(function(err) {
          if (err) console.log(err);
          else done(null, user);
                
        })
      }else if (user) {
        Users.findOne({userid: profile.id}, function(err, resul){
          if(err) err;
          if(resul) done(null, resul);
        });

      }
    })
  }))

  .use(new TwitterTokenStrategy({
    consumerKey: "SvRMQBeHtW8aIZVYQZnrxnorN",
    consumerSecret: "At91tGX1v5MMwwUvqzNUgjvpZrnCB6O41VehdJASHs86bieaFd",
  }, function(accessToken, refreshToken, profile, done) {
    Users.findOne({'userid': profile.id}, function(err, user) {
        if(err) return done(err);
        if(!user){
          user = new Users({
            userid: profile.id,
            name: profile.displayName,
            profile_image: profile._json.profile_image_url,
            token: rndString.generate()
          });

          user.save(function(err) {
            if (err) console.log(err);
            else done(null, profile);
                
          })
        } else if (user) {
            done(null, profile);
        }
    })
  }));



  router.post('/register', function(req, res, next) {
    var params = ['userid', 'pw', 'name'];

    check_param(req.body, params);
    var current = new Users({
      userid: req.body.userid,
      name: req.body.name,
      pw: req.body.pw,
      token: rndString.generate()
    });

    current.save(function(err, data) {
      if (err) { // TODO handle the error
        if (err.errmsg.indexOf("dup") !== -1) {
          return res.status(409).send("already exists");
        }else{
          return res.status(500).send("DB Error");
        }
      } else {
        return res.status(200).send(current);
      }
   });
  })

  .post('/login', function(req, res, next) {
    var params = ['userid', 'pw', 'name'];
    check_param(req.body, params, res)

    Users.findOne({ userid: req.body.userid, pw: req.body.pw}, function(err, user) {
      if (user) 
        return res.status(200).json({userid: user.userid, name: user.name, token: user.token});
      else
        return res.status(401).send("connot login");
   });
 })

  .post('/auto', function(req, res, next) {
    var params = ['token'];
    check_param(req.bdoy, params, token);
    Users.findOne({token: req.body.token}, function(err, users) {
      if (users) return res.status(200).send(resul);
      else return res.status(401).send("Un Auth");
    });
  })

  .get('/fb/token', passport.authenticate('facebook-token'), function(req, res) {
    if (req.user) {
      Users.findOne({userid: req.user.userid}, function(err, users) {
        if(err) err;
        if(users) res.status(200).send(result);
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

  .delete('/destroy', function(req, res){
    var params = ['token'];
    check_param(req.body, params, res);

    Users.remove({token: req.body.token}, function(err, users){
      if(err) return res.status(500).sned("DB ERROR");
      if(users) return res.status(200).send("good bye");
      else return res.status(404).send("user not found")
    });
  })


  // functions 
  function check_param(req_param, params, res){
     var check = params.every(str => req_param[str] != undefined || req_param[str] != null);
     if(!check) res.status(400).send("param missing");
  }

  return router;
}
