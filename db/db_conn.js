var mysql=require('mysql')

var connection =mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'xuweihao73',
    database:'ProEvento',
})
connection.connect();
var createTable=`CREATE TABLE if not exists ProEvento.user (
    userName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NULL,
    PRIMARY KEY (userName));
  
  `
connection.query(createTable,function(err,result){
    if(err){
        console.log(err)
    }
})
module.exports=connection