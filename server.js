const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
var player = [];
var size;
var currentName;
var currentScore = 0;
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
var updateScore;
app.post("/",function(req,res){
  currentName = req.body.name;
  updateScore = setInterval(updateScoreFunc,100);

});
app.post("/stopScoring", function(){
  clearInterval(updateScore);
  player.push({name: currentName, score: currentScore});
  player.sort(compare);
  if(player.length < 6)
  size = player.length;
  else
  {
    size = 5;
    player.pop();
  }
  currentScore = 0;
});

app.get("/updateLeaderBoard",function(req,res){
  res.send({success: true, players: player});
});
app.get("/updateScore",function(req,res){
  res.send({success: true, score:currentScore});
})

function updateScoreFunc(){
  currentScore++;
};



// setInterval(checkTime,1000);
// function checkTime(){
// var date = new Date();
// var hours = date.getHours();
// var minutes = date.getMinutes();
// if(hours == 23 && minutes == 59)
// player = [];
// }






app.listen(process.env.PORT || 3000,function(){
  console.log("Server started...");
})
