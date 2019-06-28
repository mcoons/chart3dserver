var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');




router.get('/charts', async (req, res) => {
    try {

      // console.log('trying to send mail.');

      
      // var transporter = nodemailer.createTransport(smtpTransport({
      //   service: 'gmail',
      //   host: 'smtp.gmail.com',
      //   auth: {
      //     user: process.env.MAIL_USERNAME,
      //     pass: process.env.MAIL_PASSWORD
      //   }
      // }));
      
      // var mailOptions = {
      //   from: 'mc@michaelcoons.tech',
      //   to: 'mcoons67@gmail.com',
      //   subject: 'Sending Email using Node.js[nodemailer]',
      //   text: 'That was easy!'
      // };
      
      // transporter.sendMail(mailOptions, function(error, info){
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });  



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