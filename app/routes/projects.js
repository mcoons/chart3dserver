var express = require('express');
var router = express.Router();

router.get('/projects', function(request, response){
    response.render('projects', {
        jumboPic: '/images/photos/denver2.jpg',
        pageTitle: 'Web Projects',
        pageID: 'projects'
    });
});

module.exports = router;