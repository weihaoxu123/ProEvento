var mysql=require('mysql')

var connection =mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'xuweihao73',
    database:'ProEvento',
})
connection.connect();
var createTable=[`CREATE TABLE if not exists ProEvento.user (
    userName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NULL,
    PRIMARY KEY (userName));`,
    `CREATE TABLE if not exists ProEvento.event (
        event_id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(45) NULL,
        owner VARCHAR(45) NOT NULL,
        description VARCHAR(255) NULL,
        link BLOB NULL,
        time DATETIME NULL,
        category VARCHAR(45) NULL,
        imgPath BLOB NULL,
        status VARCHAR(45) NULL DEFAULT 'Scheduled',
        PRIMARY KEY (event_id));
      
  `]
  for (var i=0;i<createTable.length;i++){
    connection.query(createTable[i],function(err,result){
        if(err){
            console.log(err)
        }
    })
}
module.exports=connection