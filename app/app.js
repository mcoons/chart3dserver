// var express = require("express");
// var app = express();


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


// var socketIO = require("socket.io");
// var ioServer = socketIO(server);

ioServer.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });

setInterval(
    () => { ioServer.emit('time', new Date().toTimeString());
    console.log('sending time');
}, 1000)




