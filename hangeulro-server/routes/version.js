module.exports = (router) => {

  router.get('/', (req, res, next) =>{
    return res.status(200).send("2");
  });

  return router;
}
