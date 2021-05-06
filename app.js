const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const request = require('request');
const multer = require("multer");
const ejs = require('ejs');
const fs = require("fs");


require('dotenv').config();

const app = express();


app.engine(
  "handlebars",
  exphbs({
    extname: "handlebars",
    defaultLayout: false,
    layoutsDir: "views/layouts/"
  })
);
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});


app.post('/send', (req, res) => {


  if(!req.body.captcha){
          console.log("err");
          return res.json({"success":false, "msg":"Capctha is not checked"});

      }



      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.captcha}&remoteapi=${req.connection.remoteAddress}`;

      request(verifyUrl,(err,response,body)=>{

          if(err){console.log(err); }

          body = JSON.parse(body);

            // If not successful
          // if (body.success !== undefined && !body.success)
          //   return res.json({ success: false, msg: 'Failed captcha verification' });

          // If successful
          return res.json({ success: true, msg: 'Captcha passed' });


        });






  const output = `
    <p>You'r response has been successfully submitted</p>
    <h3>Personal Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Event Details</h3>
    <ul>
      <li>Title: ${req.body.title}</li>
      <li>Date: ${req.body.date}</li>
      <li>Time: ${req.body.time}</li>
      <li>Venue: ${req.body.venue}</li>
      <li>City: ${req.body.city}</li>
      <li>State: ${req.body.state}</li>
      <li>Code: ${req.body.code}</li>
      <li>Image Uploaded: ${req.body.img}</li>
      <li>Description: <p>${req.body.description}</p></li>
    </ul>

  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
ignoreTLS: false,
secure: false, // true for 465, false for other ports like 587
    auth: {
        user: "sdobhal1234@gmail.com", // generated ethereal user
        pass: "zetnzcfajtpkiqhs"  // generated ethereal password
    }

  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '<sdobhal1234@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Event Registration', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(process.env.PORT || 3000, () => console.log('Server started...'));
