var express = require("express");
var app = express();
const localport = 5000;

// const { Pool } = require('pg');
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true
// });

app.set('port', process.env.PORT || localport);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = "Michael Coons - Software Engineer Site";

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/projects'));
app.use(require('./routes/contact'));
app.use(require('./routes/db'));

var server = app.listen(app.get('port'), function(){
    console.log("listening on port: " + app.get('port'));
});
