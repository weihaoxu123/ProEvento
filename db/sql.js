var sqls={
    register:"INSERT INTO `ProEvento`.`User` (`userName`, `password`) VALUES (?, ?);",
    selectUser:'select * from user where userName = ? ',
    loginCheck:"select * from user where userName = ? and password= ? ",
    insertEvent:"INSERT INTO `ProEvento`.`event` ( `title`, `owner`, `description`, `link`,`time`,`category`,`imgPath`) VALUES (?, ?, ?, ?,?,?,?);",
    myEventList:'select * from event where owner=?',
    getEvent:"select * from event where event_id=?"
}
module.exports=sqls