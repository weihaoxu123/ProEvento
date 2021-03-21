var sqls={
    register:"INSERT INTO `ProEvento`.`User` (`userName`, `password`) VALUES (?, ?);",
    selectUser:'select * from user where userName = ? ',
    loginCheck:"select * from user where userName = ? and password= ? "
}
module.exports=sqls