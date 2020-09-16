const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
var player = [];
var size;
app.get("/",function(req,res){
  res.render("list");  //maybe we can just do all the stuff in the js file as all of the data is there..
});

function compare(a,b){
  var ai = parseInt(a.score,10);
  var bi = parseInt(b.score,10);
  if(ai<bi)
  return 1;
  if(ai>bi)
  return -1;
  return 0;
}

app.post("/",function(req,res){
  var currentPlayer = req.body;
  player.push(currentPlayer);
  player.sort(compare);
  if(player.length < 6)
  size = player.length;
  else
  {
    size = 5;
    player.pop();
  }
});
var date = new Date();
var hours = date.getHours();
var minutes = date.getMinutes();
if(hours == 23 && minutes == 59)
player = [];
app.get("/array-api", function(req,res){
  res.json({players: player});
})





app.listen(3000,function(){
  console.log("Server started...");
})
