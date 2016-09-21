var express  = require('express');
var multer  = require('multer');
var Q = require('q');

module.exports.upload = function (req, res, boardid) {
  var deferred = Q.defer();

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "upload/");
    },

    filename: function (req, file, cb) {
      file.uploadedFile = {
        name: boardid,
        ext: file.mimetype.split('/')[1]
      };
      cb(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
    }
  });

  var upload = multer({ storage: storage }).single('file');

  upload(req, res, function (err) {
    if (err) deferred.reject();
    else deferred.resolve(req.file.uploadedFile);
  });

  return resdeferred.promise;
};
