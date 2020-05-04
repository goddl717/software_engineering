var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('subjectroom', { data: 'kim si sun' });
});


module.exports = router;