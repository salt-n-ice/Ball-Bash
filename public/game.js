var canvas = $("#canvas-ball");
var board = $("#canvas-board");
var player = $("#canvas-player");
var game = $(".game");
var start = $(".start");
var leaderBoard = $(".leader-board");
//game-variables

var players = [];
var gameHeight = 500;
var gameWidth = 1000;
var boardLength = 130;
var time =4;
var vx=2.2*Math.log(time), vy=1.5*Math.log(time);
var score=0;
var name;
var gameOver = 1;
var mouseX,mouseY;
var freshGame = 1;
//initial styles

game.css("height",gameHeight+"px").css("width", gameWidth+"px");
game.css("background-size",gameWidth+"px "+gameHeight+"px");
board.css("height",boardLength+"px");
player.css("height",boardLength+"px");
board.css("top",gameHeight/2+"px");
canvas.css("top",gameHeight/2+"px");
player.css("top",gameHeight/2+"px");

var detachGameOver = $(".game-over").detach();
var detachGame = game.detach();

var uL;
var uS;
var frame;

//the whole game
  start.click(initLock);
  function initLock()
  {
    if(freshGame == 1)
    name = $(".inputField").val();
    freshGame = 0;
    if(name=='')
    {
      alert("You will be playing Anonymously! xo")
      name = "Anonymous";
    }
    $.post("/",{name: name});
    $("game-intro").detach();
    $(".game-over").detach();
    $("body").append(detachGame);


    uL = setInterval(updateLevel,2000);
    uS = setInterval(updateScore,100);
    frame = setInterval(frames, 1);

    //revert back variables
    score =0;
    gameOver = 0;
   //revert back styles
    canvas.css("left","20px");

    $(".game-intro").detach();
    $("body").append(detachGame);

    document.body.requestPointerLock = document.body.requestPointerLock || document.body.requestPointerLock;
    document.body.requestPointerLock();


}


function frames()
{
  if(!gameOver)
  {
  var xPosLeft = canvas.css("left");
  var absLeft = xPosLeft.substring(0,xPosLeft.length-2);
  var xPosRight = canvas.css("right");
  var absRight = xPosRight.substring(0,xPosRight.length-2);


  var yPosTop = canvas.css("top");
  var yPosBottom = canvas.css("bottom");
  var ordTop = yPosTop.substring(0,yPosTop.length-2);
  var ordBottom = yPosBottom.substring(0,yPosBottom.length-2);

  if(absRight<=5)
  {
    if(vx>0)
    vx*=-1;
    check();
  }
  else if(absLeft<=5)
  {
    if(vx<0)
    vx*=-1;
    glowComputer();
  }

  if(ordBottom<=1)
  {
    if(vy>0)
    vy*=-1;
  }
  else if(ordTop<=1)
  {
    if(vy<0)
    vy*=-1;
  }

  absLeft = absLeft-(-vx);
  ordTop = ordTop -(-vy);

  canvas.css("left",absLeft+"px");
  canvas.css("top",ordTop+"px");
  if(ordTop+boardLength<gameHeight)
  board.css("top",ordTop+"px");
  }
};

//update level

function updateLevel()
{
  if(!gameOver)
  {if(vx>0)
  vx = 2.2*Math.log(time);
  else
  vx = -2.2*Math.log(time);
  if(vy>0)
  vy = 1.5*Math.log(time);
  else
  vy = -1.5*Math.log(time);
  time++;}
}

//update score

function updateScore()
{
  if(!gameOver)
  {
    $.get("/updateScore",function(data){
      if(data.success)
      {
        $(".score").text("Your Score: "+data.score);
        score++;
      }
    })
  }
}

document.addEventListener("mousemove", movePlayer);
function movePlayer(event)
{
  if(!gameOver)
  {
  var yPosTop = player.css("top");
  var ordTop = yPosTop.substring(0,yPosTop.length-2);

  mouseX = event.movementX;
  mouseY = event.movementY;

  mouseY = ordTop-(-mouseY);
  if(mouseY+boardLength<gameHeight && mouseY>0)
  player.css("top",mouseY+"px");
}

}





  //functions
  //Check for game over

  function check()
  {
    var xPosRight = canvas.css("right");
    var absRight = xPosRight.substring(0,xPosRight.length-2);

    var yPosTop = canvas.css("top");
    var ordTop = yPosTop.substring(0,yPosTop.length-2);

    if(ordTop<=mouseY-15 || (mouseY - (-boardLength) <= ordTop))
    {
      var audio = new Audio("/game-over.mp3");
      audio.play();
      document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock;

         // Attempt to unlock
          document.exitPointerLock();
      detachGame = game.detach();
      $("body").append(detachGameOver);
      gameOver = 1;
      time = 4;
      vx = 2*Math.log(time);
      console.log("Game Over");
      $.post("/stopScoring",score);

      $.get("/updateLeaderBoard",function(data){
        if(data.success)
        {
          players = data.players;
          leaderBoard.html("<th>Name</th> <th>Score</th>");
          for(var i=0; i<players.length; i++)
          {
            leaderBoard.append("<tr><td>"+players[i].name+"</td> <td>"+players[i].score+"</td></tr>");
          }
        }
      });
      clearInterval(uL);
      clearInterval(uS);
      clearInterval(frame);

      //exit pointer lock and add the game over screen with the scoreboard and a button to play again
    }
    else
    {
      canvas.addClass("more-glow");
      player.addClass("more-glow");

      var audio = new Audio("/hit.mp3");
      audio.play();

      setTimeout(rem,100);
      function rem(){
        canvas.removeClass("more-glow");
        player.removeClass("more-glow");
      }
    }
  }


  //glow the computer board on impact
  function glowComputer()
  {
    canvas.addClass("more-glow");
    board.addClass("more-glow");

    var audio = new Audio("/hit.mp3");
    audio.play();

    setTimeout(rem,100);
    function rem(){
      canvas.removeClass("more-glow");
      board.removeClass("more-glow");
    }
  }


  function compare(a,b){
    var ai = parseInt(a,10);
    var bi = parseInt(b,10);
    if(ai>bi)
    return 1;
    if(ai<bi)
    return -1;
    return 0;
  }
