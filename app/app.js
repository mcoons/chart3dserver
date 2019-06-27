
var express = require('express');
var app = express();
var http = require('http').Server(app);
var ioServer = require('socket.io')(http);

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

var server = http.listen(app.get('port'), function(){
    console.log("listening on port: " + app.get('port'));
});


ioServer.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
    socket.on('msg', (msg)=>{console.log(msg); console.log(socket.id)});
});


setInterval(
    () => { ioServer.emit('time', new Date().toTimeString());
//    console.log(new Date().toTimeString());
}, 1000)




