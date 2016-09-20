var express = require('express');
var router = express.Router();

router.get('/:image', function(req, res, next) {
    res.sendFile("/node/server-backend/hangeulro-server/upload/"+req.params.image);
});


module.exports = router;
