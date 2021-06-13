//mysql database
const mysql = require("mysql");

var mysqlConnection=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"client",
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

module.exports = mysqlConnection;
