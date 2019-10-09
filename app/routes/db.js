var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

router.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM chart_data order by id asc');

      res.render('db', { 'results': (result) ? result.rows : null,
                         jumboPic: '/images/photos/denver.jpg',
                         pageTitle: 'Data',
                         pageID: 'data'
                } );
      client.release();
    } 
    catch (err) {
      console.error(err);
      res.send("Error " + err);
    }

});

module.exports = router;