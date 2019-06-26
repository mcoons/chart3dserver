var express = require('express');
var router = express.Router();

router.get('/', function(request, response){
    response.render('index', {
        jumboPic: '/images/photos/denver.jpg',
        pageTitle: 'Home',
        pageID: 'home'
    });
});

module.exports = router;