var express = require('express');
var router = express.Router();
var Q = require('q');
var multer = require('multer');

var upload = function (req, res) {
    var deferred = Q.defer();
    var storage = multer.diskStorage({
        // 서버에 저장할 폴더
        destination: function (req, file, cb) {
            cb(null, "upload/");
        },

        // 서버에 저장할 파일 명
        filename: function (req, file, cb) {
            file.uploadedFile = {
                name: req.params.filename,
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
    return deferred.promise;
};

router.post('/:filename', function(req, res, next) {
    upload(req, res).then(function (file) {
        res.json({file:file, token:req.body.token});
    }, function (err) {
        res.status(500).send(err);
    });
});




module.exports = router;
