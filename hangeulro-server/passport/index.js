var FacebookTokenStrategy = require('passport-facebook-token');
var TwitterTokenStrategy = require('passport-twitter-token');
var social = require('./social');
module.exports = (passport)=>{
//serialize
    passport.serializeUser(function(user, done) {done(null, user);});
    passport.deserializeUser(function(obj, done) {done(null, obj);});

    passport.use(new FacebookTokenStrategy({
        clientID: social.facebook.clientID,
        clientSecret: social.facebook.clientSecret,
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
}