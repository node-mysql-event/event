const express = require('express');
const bodyParser = require('body-parser');
// const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const request = require('request');
const multer = require("multer");
const ejs = require('ejs');
const fs = require("fs");

//admin login
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
// const router = require('./router');


let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({storage: storage});
// var upload = multer({ dest: './public/uploads/' })



//mysql database
const mysql = require("mysql");

var mysqlConnection=mysql.createConnection({
  host:"eventdb.cexlqevmgh8c.us-east-2.rds.amazonaws.com",
  user:"admin",
  password:"admin123",
  database:"event",
  multipleStatements : true
});

mysqlConnection.connect((err)=>{
  if(!err)
  {
    console.log("connected");
  }   else   {
    console.log("connection failed");
  }
});




require('dotenv').config();

const app = express();



// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//fetch databasevar
logger = require('morgan');
var cookieParser = require('cookie-parser');

 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs');

 app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/registration-form', (req, res) => {
  res.render('registration-form');
});

app.get('/', (req, res) => {
  res.render('registration-form');
});



app.post('/send', upload.array('uploaded_file'), (req, res) => {
console.log(req.files);
var img = new Array();
  if (!req.files) {
          console.log("No file received");


        } else {

          for (var i = 0; i < req.files.length; i++) {
            if (req.files[i]!='undefined') {
              img[i]=req.files[i].filename;

            }else{
              img[i]='NULL';
            }
          }
          console.log('file received');
          console.log(req);

          var sql = "INSERT INTO registered_users (id, name, email, phone, title, date, time, venue, city, state, code, img, img2, img3, img4, img5, description) VALUES (null , '"+req.body.name+"', '"+req.body.email+"', '"+req.body.phone+"', '"+req.body.title+"', '"+req.body.date+"', '"+req.body.time+"', '"+req.body.venue+"', '"+req.body.city+"', '"+req.body.state+"', '"+req.body.code+"', '" + img[0] + "', '" + img[1] + "', '" + img[2] + "', '" + img[3] + "', '" + img[4] + "', '"+req.body.description+"')";

            mysqlConnection.query(sql, function(err) {
              if (err) throw err;
                console.log("record inserted");
            })

          message = "Successfully! uploaded";

        }

  //google recaptcha
  // if(!req.body.captcha){
  //         console.log("err");
  //         return res.json({"success":false, "msg":"Capctha is not checked"});
  //
  //     }



      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.captcha}&remoteapi=${req.connection.remoteAddress}`;

      request(verifyUrl,(err,response,body)=>{

          if(err){console.log(err); }

          body = JSON.parse(body);

            // If not successful
          // if (body.success !== undefined && !body.success)
          //   return res.json({ success: false, msg: 'Failed captcha verification' });

          // If successful
          // return res.json({ success: true, msg: 'Captcha passed' });
          res.render('registration-form');


        });











// ///mail
//     var sql='SELECT * FROM registered_users';
//     mysqlConnection.query(sql, function (err, data, fields) {
//     if (err) throw err;
//
//
//     const output = `
//       <p>You'r response has been successfully submitted</p>
//       <h3>Personal Details</h3>
//       <ul>
//         <li>Name: ${req.body.name}</li>
//         <li>Email: ${req.body.email}</li>
//         <li>Phone: ${req.body.phone}</li>
//       </ul>
//       <h3>Event Details</h3>
//       <ul>
//         <li>Title: ${req.body.title}</li>
//         <li>Date: ${req.body.date}</li>
//         <li>Time: ${req.body.time}</li>
//         <li>Venue: ${req.body.venue}</li>
//         <li>City: ${req.body.city}</li>
//         <li>State: ${req.body.state}</li>
//         <li>Code: ${req.body.code}</li>
//
//         <li>Description: <p>${req.body.description}</p></li>
//       </ul>
//
//
//     `;
//
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 587,
//     ignoreTLS: false,
//     secure: false, // true for 465, false for other ports like 587
//       auth: {
//           user: process.env.USER, // generated ethereal user
//           pass: process.env.PASSWORD  // generated ethereal password
//       }
//
//     });
//
//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: process.env.EMAIL, // sender address
//         to: req.body.email, // list of receivers
//         subject: 'Event Registration', // Subject line
//         text: 'Hello world?', // plain text body
//         html: output // html body
//     };
//
//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//
//         res.render('registration-form', {msg:'Email has been sent'});
//     });
//
//
//     });










  });

// app.post('/stats', upload.single('uploaded_file'), function (req, res) {
//    // req.file is the name of your file in the form above, here 'uploaded_file'
//    // req.body will hold the text fields, if there were any
//    console.log(req.file, req.body)
// });



  // load static assets
  app.use('/static', express.static(path.join(__dirname, 'public')))
  app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

  app.use(session({
      secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
      resave: false,
      saveUninitialized: true
  }));

  // app.use('/route', router);

  // admin-login route
  app.get('/admin', (req, res) => {



      // var sql='SELECT * FROM selected_users';
      // mysqlConnection.query(sql, function (err, data, fields) {
      // if (err) throw err;
      res.render('admin');
    // });

  });


 // app.get('/dashboard',(req, res)=>{
 //   var sql = "SELECT * FROM registered_users";
 //   sqlConnection.query(sql, (err, rows)=>{
 //     if(err)
 //     {
 //       console.log("failed to fetch data");
 //     }
 //     res.json(rows);
 //   })
 // })










 const  credential = {
     email : "admin@gmail.com",
     password : "admin123"
 }

 // login user
 app.post('/login', (req, res)=>{
     if(req.body.email == credential.email && req.body.password == credential.password){
         req.session.user = req.body.email;
         res.redirect('/dashboard');
         //res.end("Login Successful...!");
     }else{
         res.end("Invalid Username or Password")
     }
 });

 // route for dashboard
 app.get('/dashboard', function(req, res, next) {
   if(req.session.user){

     var sql='SELECT * FROM registered_users';
     mysqlConnection.query(sql, function (err, data, fields) {
     if (err) throw err;
     res.render('user-list', { title: 'User List', userData: data, user : req.session.user});
   });


   }else{
       res.send("Unauthorize User")
   }

 });


 // route for logout
 app.get('/logout', (req ,res)=>{
     req.session.destroy(function(err){
         if(err){
             console.log(err);
             res.send("Error")
         }else{

             res.render('admin', { title: "Express", logout : "logout Successfully...!"})
         }
     })
 })



 // app.post('/delete/:id', (req, res) => {
 //     con.query(`DELETE FROM NodeSQL WHERE id=?;`,id, function (err, result) {
 //         if (err) throw err;
 //     });
 // });

 app.use('/delete/:id', function(req, res, next) {
  var id= req.params.id;
    var sql = 'DELETE FROM registered_users WHERE id = ?';
    mysqlConnection.query(sql, [id], function (err, data) {
    if (err) throw err;
    console.log(data.affectedRows + " record(s) updated");
  });
  res.redirect('/dashboard');

});


app.use('/add/:id', function(req, res, next) {
 var id= req.params.id;
   var sql = "INSERT INTO `selected_users` SELECT * FROM registered_users WHERE id = ?";
   var sql2 = 'DELETE FROM registered_users WHERE id = ?';

   mysqlConnection.query(sql, [id], function (err, data) {
   if (err) {
     throw err;
   }else{
     mysqlConnection.query(sql2, [id], function (err, data) {
     if (err) throw err;
   });
   }

 });

 res.redirect('/dashboard');

});



app.get('/events', (req, res) => {



    var sql='SELECT * FROM selected_users';
    mysqlConnection.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('events', { title: 'User List', userData: data});
  });

});


app.listen(process.env.PORT || 3000, () => console.log('Server started...'));
