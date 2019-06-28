var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');






router.get('/charts', async (req, res) => {
    try {

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
      });

      var mailOptions = {
        from: 'mc@michaelcoons.tech',
        to: 'mcoons67@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });



      res.render('charts', { 
                         jumboPic: '/images/photos/denver.jpg',
                         pageTitle: 'Charts',
                         pageID: 'charts'
                } );
    } 
    catch (err) {
      console.error(err);
      res.send("Error " + err);
    }

});

module.exports = router;