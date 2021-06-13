// var express = require("express");
// const exphbs = require('express-handlebars');
// var router = express.Router();
//
// //mysql database
// const mysql = require("mysql");
//
// var mysqlConnection=mysql.createConnection({
//   host:"localhost",
//   user:"root",
//   password:"",
//   database:"client",
//   multipleStatements : true
// });
//
// mysqlConnection.connect((err)=>{
//   if(!err)
//   {
//     console.log("connected");
//   }   else   {
//     console.log("connection failed");
//   }
// });
//
// // const app = express();
// //
// // app.engine(
// //   "handlebars",
// //   exphbs({
// //     extname: "handlebars",
// //     defaultLayout: false,
// //     layoutsDir: "views/layouts/"
// //   })
// // );
// // app.set('view engine', 'handlebars');
//
//
// const  credential = {
//     email : "admin@gmail.com",
//     password : "admin123"
// }
//
// // login user
// router.post('/login', (req, res)=>{
//     if(req.body.email == credential.email && req.body.password == credential.password){
//         req.session.user = req.body.email;
//         res.redirect('/dashboard');
//         //res.end("Login Successful...!");
//     }else{
//         res.end("Invalid Username")
//     }
// });
//
// // route for dashboard
// router.get('/dashboard', (req, res) => {
//     if(req.session.user){
//
//       // var sql = "SELECT * FROM tests";
//       //
//       //   mysqlConnection.query(sql, function(err, rows, fields) {
//       //     if (err) throw err;
//       //       console.log("record fetched");
//       //       console.log(rows);
//
//             // var sql = "SELECT * FROM tests";
//             // mysqlConnection.query(sql, (err, rows)=>{
//             //   if(err)
//             //   {
//             //     console.log("failed to fetch data");
//             //   }
//             //   // res.json(rows);
//             //   res.render('dashboard', {user : req.session.user, items: rows});
//             // })
//
//               // res.render('dashboard', {user : req.session.user});
//
//
//
//          // });
//
//         res.render('user-list', {user : req.session.user})
//     }else{
//         res.send("Unauthorize User")
//     }
// })
//
// // route for logout
// router.get('/logout', (req ,res)=>{
//     req.session.destroy(function(err){
//         if(err){
//             console.log(err);
//             res.send("Error")
//         }else{
//             res.render('admin', { title: "Express", logout : "logout Successfully...!"})
//         }
//     })
// })
//
// module.exports = router;
