module.exports = (router) => {
  router.get('/version', (req, res, next) =>{
    return res.status(200).send("4");
  });

  return router;
}
