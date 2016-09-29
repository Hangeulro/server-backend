var express = require('express');
var router = express.Router();
var rndString = require("randomstring");

router.get('/', function(req, res, next) {
  return res.status(200).send("1");
});

module.exports = router;
