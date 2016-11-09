var express = require('express');
var router = express.Router();

router.get('/:image', function(req, res, next) {
    res.sendFile("/node/server-backend/hangeulro-server/upload/"+req.params.image);
});


router.get('/users/:image', function(req, res, next) {
    res.sendFile("/node/server-backend/hangeulro-server/upload/users/"+req.params.image+".png");
});

module.exports = router;
