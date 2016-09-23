
    router.use(passport.initialize());
    router.use(passport.session());

    var FacebookTokenStrategy = require('passport-facebook-token');
    var rndString = require("randomstring");

    passport.serializeUser(function(user,done){
        done(null, user);
    });

    passport.deserializeUser(function(obj, done){
        done(null, obj);
    });

    passport.use(new FacebookTokenStrategy({
        clientID : "1213122912074048",
        clientSecret : "259b6ddcb09ade12157f47f4fb2d5c95",
        profileFields : ['id', 'photos', 'age','gender', 'permissions'],
    }, function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        Users.findOne({'userid' : profile.id}, function (err, user) {
            if(err){
                return done(err);
            }

            if(!user){
                user = new Users({
                    userid: profile.id,
                    profileImg: profile.photos
                });

                user.save(function (err) {
                    if(err) console.log(err);
                    else{
                        done(null, profile);
                    }
                })
            }
            else if(user){
                done(null, profile);
            }
        })
    }));

    router.get('/fb/token', passport.authenticate('facebook-token', {session: false, scope : ['user_friends', 'manage_pages']}),
        function (req, res) {
            console.log("user token : " + req.param('access_token'));
            if(req.user){
                res.send(200, req.user);
            }
            else if(!req.user){
                res.send(401, req.user);
            }
        });

    router.get('/fb/callback', passport.authenticate('facebook-token', {
        successRedirect : '/',
        failureRedirect : '/'
    }));


    router.post('/register', function (req, res) {
        user = new User({
            _id : randomString.generate(13),
            id : req.param('user_id'),
            password : req.param('password'),
            api_token : randomString.generate(15),
            user_type : "false"
        });
        user.save(function (err) {
            if(err){
                console.log("/auth/register Failed");
                throw err;
            }
            else{
                console.log("user register : " + user);
                res.send(200, user);
            }
        });


    });

    router.post('/authenticate', function (req, res) {
        console.log('Auth Key : ' + req.param('token'));
        User.findOne({api_token : req.param('token')}, function(err, result){
            if(err){
                console.log("/auth/authenticate failed");
                throw err;
            }
            console.log("User "+result+"Logged In");
            res.send(200, result);
        })
    });

