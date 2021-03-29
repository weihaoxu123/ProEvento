var MySql = require('sync-mysql');

var connection = new MySql({
  host: 'localhost',
  port:"3306",
  user: 'root',
  password: 'xuweihao73',
  database: 'ProEvento'
});
module.exports=connection