var sqls={
    register:"INSERT INTO `ProEvento`.`User` (`userName`, `password`) VALUES (?, ?);",
    selectUser:'select * from user where userName = ? ',
    loginCheck:"select * from user where userName = ? and password= ? ",
    insertEvent:"INSERT INTO `ProEvento`.`event` ( `title`, `owner`, `description`, `link`,`time`,`category`,`imgPath`) VALUES (?, ?, ?, ?,?,?,?);",
    myEventList:'select * from event where owner=?',
    getEvent:"select * from event where event_id=?",
    startEvent:"update event set status='Started' where event_id=?",
    endEvent:"update event set status='Completed' where event_id=?",
    updateProfile:"update user set gender=?, profession=?,avtar=?,motto=?,birthday=? where userName=?",
    searchPeople:"select * from user where userName like ?",
    searchSpecificPeople:"select * from user where userName= ?",
    searchEvent:"select * from event where title like ?"
}
module.exports=sqls