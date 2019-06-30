
var express = require('express');
var app = express();
var http = require('http').Server(app);
var ioServer = require('socket.io')(http);
var nodemailer = require('nodemailer');


const localport = 5000;

app.set('port', process.env.PORT || localport);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = "Michael Coons - Software Engineer Site";

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/projects'));
app.use(require('./routes/contact'));
app.use(require('./routes/db'));
app.use(require('./routes/charts'));

var server = http.listen(app.get('port'), function(){
    console.log("listening on port: " + app.get('port'));
});


ioServer.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
    socket.on('msg', (msg)=>{console.log(msg); console.log(socket.id)});
 
    socket.on('updateSceneRequest', (scene, options) => {
        console.log('updateSceneRequest');
        console.log(scene);
        console.log(options);
        socket.emit('updateSceneOrder', scene, options);
    });
 
    socket.on('addChartRequest', (chart, options) => {
        console.log('addChartRequest');
        console.log(chart);
        console.log(options);
        socket.emit('addChartOrder', chart, options);
    });
 
 
    socket.on('updateChartRequest', (chart, options) => {
        console.log('updateChartRequest');
        console.log(chart);
        console.log(options);
        socket.emit('updateChartOrder', chart, options);
    });
 
 
    socket.on('removeChartRequest', (chart, options) => {
        console.log('removeChartRequest');
        console.log(chart);
        console.log(options);
        socket.emit('removeChartOrder', chart, options);
    });
 
 
 
    socket.on('APIrequest', (options) => { 
        console.log('APIrequest');
        console.log(options);
        socket.emit('APIreply', options)
    });
});


setInterval(
    () => { ioServer.emit('time', new Date().toTimeString());
//    console.log(new Date().toTimeString());
}, 1000)


