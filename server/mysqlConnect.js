const mysql =require("mysql")

var connection=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"1254029300",
  database:"student"
});

function select(){
  connection.connect((err)=>{
    if(err){
      console.log("connection err");
      throw err;
    }
    console.log("connectionID:" + connection.threadId);
  })
  connection.query('SELECT * FROM student',function(error,result,fields){
    if(error){
      throw error;
    }
    console.log(result);
  })
  //关闭连接
  connection.end();
}
