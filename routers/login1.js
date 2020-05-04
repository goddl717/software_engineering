var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

    res.sendFile(__dirname + '/app/login1.html');
});

module.exports = router;