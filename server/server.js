const http=require("http")
const express=require('express')
const mysql=require('mysql')
const bodyParser=require("body-parser")

const app=express()
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login',function(req,res){
  //var user_name=req.body.name;
  var obj=req.body;

  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","content-type");
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  res.end("yes");
});
app.listen(3000);
