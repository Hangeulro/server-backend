module.exports = (router) =>{
  router.get('/image/:image', function(req, res, next) {
    res.sendFile("/node/server-backend/hangeulro-server/upload/"+req.params.image);
  })

  .get('/users/:image', function(req, res, next) {
    res.sendFile("/node/server-backend/hangeulro-server/upload/users/"+req.params.image+".png");
  });

  return router;
}
