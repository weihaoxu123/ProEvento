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
    gender VARCHAR(20) NULL,
    profession VARCHAR(255) NULL,
    avtar BLOB NULL,
    motto VARCHAR(255) NULL,
    birthday DATE NULL,
    deactivated TINYINT NULL DEFAULT 0,
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
        PRIMARY KEY (event_id));`,
    `CREATE TABLE if not exists ProEvento.follower (
        follow VARCHAR(255) NULL,
        followed VARCHAR(255) NULL);`,
    `CREATE TABLE if not exists ProEvento.invitation (
        event_id INT NULL,
        invited_user VARCHAR(255) NULL);`
    ]
  for (var i=0;i<createTable.length;i++){
    connection.query(createTable[i],function(err,result){
        if(err){
            console.log(err)
        }
    })
}
module.exports=connection