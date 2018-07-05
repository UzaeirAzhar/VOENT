var express = require('express');
var router = express.Router();
var TLCallBackClass = require("../Generic/TLCallResponseClass");

router.get('/', function(req, res, next) {
    res.render('../index.html');
});

module.exports = router;
