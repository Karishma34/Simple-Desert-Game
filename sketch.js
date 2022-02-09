/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


In this game project, the two main extensions were implementing the platforms and enemies. The enemies are camouflaged robots and the platforms are floating rocks. The enemies were created with the constructor functions and the platforms were created with the factory pattern. The sound and the graphics were also implemented but the focused extensions were the platforms and the enemies. The bits that I found challenging was implementing the platforms and enemies at the same time. The reason for this was the same function name that I had implemented for both the platforms and the enemies. When the game character detects these extensions, it was supposed to lose a life and be able to stand on the platform. Since the same function name was used to detect the extensions only one could work which was challenging to overcome. I learnt more about how the constructor functions and factory pattern work together in specific game code, about how arrays work and how to insert audio clips by implementing these extensions. 

*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var trees_x;
var clouds;
var mountains;
var mountains2;
var canyon;
var collectables;
var platforms;

var game_score;
var flagpole;
var lives;
var cacti;


var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var enemies;

var bolders;



var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    BackgroundSound = loadSound('assets/Background.wav');
    BackgroundSound.setVolume(0.3);
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.5);
    gameover = loadSound('assets/gameover.wav');
    gameover.setVolume(0.5);
    victorySound = loadSound('assets/Victory.wav');
    victorySound.setVolume(0.1);
}


function setup()
{
    
    init();
}

function init()
{
   
    createCanvas(1024, 576);
	floorPos_y = height * 3/4;

    lives = 3;
    game_score = 0;
    flagpole = {isReached: false, x_pos: 3500};
    startGame();
    
   
}


function draw()
{
	background(19,24,98, 200); // fill the sky blue
   
    
	noStroke();
	fill(107,142,35);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos,0);
	// Draw clouds.
    drawClouds();
	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTrees();
    
    //DrawBolders
    drawBolders();
    
    
   
	// Draw canyons.
    for(var i =0; i<canyon.length; i++)
    {
       drawCanyon(canyon[i]);
       checkCanyon(canyon[i]);
       
    }
     checkRisingOrFalling();
	// Draw collectable items.
    for(var i = 0; i<collectables.length;i++)
    {
        if(collectables[i].isFound == false)
        {
             drawCollectable(collectables[i])
             checkCollectable(collectables[i]);
        }
    }
    for(var i = 0; i<cacti.length;i++)
    {
        if(cacti[i].isFound == false)
        {
            drawCacti(cacti[i])
            CheckCacti(cacti[i]);
        }
    }
    //draw platform
   
    for(var i = 0; i<platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    renderFlagpole();
    
    for(var i = 0; i<enemies.length;i++)
    {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x,gameChar_y)
        
        if(isContact)
            {
            if(lives > 0)
               {
                startGame();
                lives = lives -1
                break;                   
               }
             }
    }
    
    checkVictoryOrLost();
    checkPlayerDie();
    
    pop();
	// Draw game character
	
	drawGameChar();
    
  
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
 
	// Logic to make the game character rise and fall.
    
     if(gameChar_y < floorPos_y)
        { 
            
            var isContactPlatform = false;
            for(var i = 0; i < platforms.length; i++)
            {   
                if(platforms[i].checkContactPlatform(gameChar_world_x,gameChar_y) == true)
                {
                    isContactPlatform = true;
                    break;
                }
            }
        }if(isContactPlatform == false)
            {
                gameChar_y +=1;
                isFalling = true;
            }else if(gameChar_y == floorPos_y - 100) 
            {
                 isFalling = false;
            }
        
 
    
    if(flagpole.isReached==false)
    {
        checkFlagpole();
    }
    
    fill(255);
    noStroke();
    text("score : " + game_score,20,20)
    
    fill(255);
    noStroke();
    text("lives : " + lives,20,40)
    text("Note to players:To enable sound press the space bar once" , 20,80)
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
      //game over and level complete code
  if(lives<1)
    {
        fill(255);
        strokeWeight(3)
        text('Game Over. Press "A" key to restart', width/2, height/2)
      
        return;
        
    }
    if(flagpole.isReached==true)
    {
        fill(255);
        strokeWeight(3);
        text('Level complete. Press space bar to continue', width/2, height/2)
    
       return;
        
    }
    
    // drawtoken
    var x_pos = 20
    var xpos = 23
    var x = 18
    for(var i = 0; i<lives; i++)
    {
        fill(255, 0, 0)
        ellipse(x_pos + i * 10, 60, 5)
        ellipse(xpos + i * 10, 60, 5)
        triangle(x + i*10, 61.5, x+3.5+i*10, 65, x+7+i*10, 61.5)
    }
    

}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	console.log("press" + keyCode);
	console.log("press" + key);

    
    if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = true;
    }
    else if(keyCode == 39)
    {
        console.log("right arrow");
        isRight = true;
    
    }
    else if(keyCode ==32 && flagpole.isReached == true)
    {
       init();
       flagpole.isReached = false;
       game_score = 0;
        
    }
    else if(keyCode == 32 && gameChar_y == floorPos_y)
    {
        console.log("space-bar");
        gameChar_y = gameChar_y - 175;
        isFalling = true;
        jumpSound.play();
       
       
       
    }
    else if (keyCode == 65 && lives < 1)
    {
        init();
    }
   
}




function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    
    console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);
    
    if(keyCode == 37){
        console.log("left arrow");
        isLeft = false;
    }
    else if(keyCode == 39){
        console.log("right arrow");
        isRight = false;
     
   }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
    fill(255,218,185);
    ellipse(gameChar_x, gameChar_y - 60, 7, 17);
    triangle(gameChar_x - 1.5,gameChar_y - 55, gameChar_x, gameChar_y - 50, gameChar_x+1.5, gameChar_y - 55)
    rect(gameChar_x - 0.25, gameChar_y - 52, 1,5)
    
    
    fill(153, 0, 0);
    triangle(gameChar_x - 3.5, gameChar_y - 47, gameChar_x,gameChar_y - 25, gameChar_x + 3.5, gameChar_y - 47);
    triangle(gameChar_x - 3.5, gameChar_y - 15, gameChar_x, gameChar_y - 35, gameChar_x + 3.5, gameChar_y-15)
    
    fill(255,218,185)
    
    beginShape()
    vertex(gameChar_x - 2.5, gameChar_y - 18)
    vertex(gameChar_x - 7.5, gameChar_y - 18)
    vertex(gameChar_x - 2.5, gameChar_y - 11)
    vertex(gameChar_x - 1.25, gameChar_y - 11)
    vertex(gameChar_x - 4.25, gameChar_y - 16)
    vertex(gameChar_x - 2.5, gameChar_y - 16)
    endShape();
    
    beginShape()
    vertex(gameChar_x - 2.5, gameChar_y - 17)
    vertex(gameChar_x - 7.5, gameChar_y - 17)
    vertex(gameChar_x - 2.5, gameChar_y - 10)
    vertex(gameChar_x - 1.25, gameChar_y - 10)
    vertex(gameChar_x - 4.25, gameChar_y - 15)
    vertex(gameChar_x - 2.5, gameChar_y - 15)
    endShape(); 
 
    beginShape()
    vertex(gameChar_x - 1, gameChar_y - 47)
    vertex(gameChar_x - 1, gameChar_y - 45)
    vertex(gameChar_x - 6, gameChar_y - 40)
    vertex(gameChar_x - 10, gameChar_y - 45)
    vertex(gameChar_x - 8, gameChar_y - 46)
    vertex(gameChar_x - 6, gameChar_y - 42)
    endShape();
    
    fill(190, 0, 0)
    rect(gameChar_x - 4.5, gameChar_y - 10, 4, 2)
    rect(gameChar_x - 4, gameChar_y - 10.75, 4, 2)
    
    fill(255,0,0)
    triangle(gameChar_x - 2.5, gameChar_y - 8, gameChar_x + -1.5, gameChar_y + 2, gameChar_x -0.5, gameChar_y - 8)
    
    fill(190,0,0)
    triangle(gameChar_x - 3, gameChar_y - 7, gameChar_x - 2, gameChar_y - 9, gameChar_x - 1, gameChar_y - 7)
    triangle(gameChar_x - 2.5, gameChar_y - 8, gameChar_x - 1.5, gameChar_y - 10, gameChar_x -0.5, gameChar_y - 8)
    fill(255,0,0)
    triangle(gameChar_x - 3, gameChar_y - 7, gameChar_x - 2, gameChar_y + 3, gameChar_x - 1, gameChar_y - 7)
    
    
    
    fill(255, 255, 51)
    ellipse(gameChar_x , gameChar_y - 62, 2, 5)
    
    
    fill(190, 0, 0)
    beginShape()
    vertex(gameChar_x - 1, gameChar_y - 65)
    vertex(gameChar_x -4 , gameChar_y - 60)
    vertex(gameChar_x -4 , gameChar_y - 55)
    vertex(gameChar_x - 1, gameChar_y - 60)
    endShape();
    
    fill(255,251,182)
    beginShape()
    vertex(gameChar_x , gameChar_y - 62)
    vertex(gameChar_x + 2, gameChar_y - 67)
    vertex(gameChar_x + 2, gameChar_y - 25)
    vertex(gameChar_x , gameChar_y - 25)
    vertex(gameChar_x , gameChar_y - 62)
    endShape();
    

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
                fill(255,218,185);
    ellipse(gameChar_x, gameChar_y - 60, 7, 17);
    triangle(gameChar_x - 1.5,gameChar_y - 55, gameChar_x, gameChar_y - 50, gameChar_x+1.5, gameChar_y - 55)
    rect(gameChar_x - 0.25, gameChar_y - 52, 1,5)
    
    
    fill(153, 0, 0);
    triangle(gameChar_x - 3.5, gameChar_y - 47, gameChar_x,gameChar_y - 25, gameChar_x + 3.5, gameChar_y - 47);
    triangle(gameChar_x - 3.5, gameChar_y - 15, gameChar_x, gameChar_y - 35, gameChar_x + 3.5, gameChar_y-15)
    
    fill(255,218,185)
   
    beginShape()
    vertex(gameChar_x + 2.5, gameChar_y - 18)
    vertex(gameChar_x + 7.5, gameChar_y - 18)
    vertex(gameChar_x + 2.5, gameChar_y - 11)
    vertex(gameChar_x + 1.25, gameChar_y - 11)
    vertex(gameChar_x + 4.25, gameChar_y - 16)
    vertex(gameChar_x + 2.5, gameChar_y - 16)
    endShape();
    
    beginShape()
    vertex(gameChar_x + 2.5, gameChar_y - 17)
    vertex(gameChar_x + 7.5, gameChar_y - 17)
    vertex(gameChar_x + 2.5, gameChar_y - 10)
    vertex(gameChar_x + 1.25, gameChar_y - 10)
    vertex(gameChar_x + 4.25, gameChar_y - 15)
    vertex(gameChar_x + 2.5, gameChar_y - 15)
    endShape(); 
    
    beginShape()
    vertex(gameChar_x + 1, gameChar_y - 47)
    vertex(gameChar_x , gameChar_y - 47)
    vertex(gameChar_x , gameChar_y - 35)
    vertex(gameChar_x + 5, gameChar_y - 35)
    vertex(gameChar_x + 5, gameChar_y - 37)
    vertex(gameChar_x + 1, gameChar_y - 37)
    endShape();
    
    
    fill(190, 0, 0)
    rect(gameChar_x , gameChar_y - 10, 4, 2)
    rect(gameChar_x + 0.5, gameChar_y - 10.5, 4, 2)
    fill(255,0,0)
    triangle(gameChar_x + 2.5, gameChar_y - 8, gameChar_x + 1.5, gameChar_y + 2, gameChar_x + 0.5, gameChar_y - 8)
    
    fill(190,0,0)
    triangle(gameChar_x + 3, gameChar_y - 7, gameChar_x + 2, gameChar_y - 9, gameChar_x + 1, gameChar_y - 7)
    triangle(gameChar_x + 2.5, gameChar_y - 8, gameChar_x + 1.5, gameChar_y - 10, gameChar_x + 0.5, gameChar_y - 8)
    fill(255,0,0)
    triangle(gameChar_x + 3, gameChar_y - 7, gameChar_x + 2, gameChar_y + 3, gameChar_x + 1, gameChar_y - 7)
    
    
    
    fill(255, 255, 51)
    ellipse(gameChar_x , gameChar_y - 62, 2, 5)
    
    
    fill(190, 0, 0)
    beginShape()
    vertex(gameChar_x + 4, gameChar_y - 55)
    vertex(gameChar_x + 1, gameChar_y - 60)
    vertex(gameChar_x +1, gameChar_y - 65)
    vertex(gameChar_x +4, gameChar_y - 60)
    endShape();
    rect(gameChar_x - 3, gameChar_y - 62.5, 4,2)
    
    
    fill(255,251,182)
    beginShape()
    vertex(gameChar_x , gameChar_y - 62)
    vertex(gameChar_x + 2, gameChar_y - 67)
    vertex(gameChar_x + 2, gameChar_y - 25)
    vertex(gameChar_x , gameChar_y - 25)
    vertex(gameChar_x , gameChar_y - 62)
    endShape();
	}
	else if(isLeft)
	{
		// add your walking left code
        fill(255,218,185);
    ellipse(gameChar_x, gameChar_y - 60, 7, 17);
    triangle(gameChar_x - 1.5,gameChar_y - 55, gameChar_x, gameChar_y - 50, gameChar_x+1.5, gameChar_y - 55)
    rect(gameChar_x - 0.25, gameChar_y - 52, 1,5)
    
    
    fill(153, 0, 0);
    triangle(gameChar_x - 3.5, gameChar_y - 47, gameChar_x,gameChar_y - 25, gameChar_x + 3.5, gameChar_y - 47);
    triangle(gameChar_x - 3.5, gameChar_y - 15, gameChar_x, gameChar_y - 35, gameChar_x + 3.5, gameChar_y-15)
    
    fill(255,218,185)
    fill(255,218,185)
    
    beginShape()
    vertex(gameChar_x - 2.5, gameChar_y - 18)
    vertex(gameChar_x - 7.5, gameChar_y - 18)
    vertex(gameChar_x - 2.5, gameChar_y - 11)
    vertex(gameChar_x - 1.25, gameChar_y - 11)
    vertex(gameChar_x - 4.25, gameChar_y - 16)
    vertex(gameChar_x - 2.5, gameChar_y - 16)
    endShape();
    
    beginShape()
    vertex(gameChar_x - 2.5, gameChar_y - 17)
    vertex(gameChar_x - 7.5, gameChar_y - 17)
    vertex(gameChar_x - 2.5, gameChar_y - 10)
    vertex(gameChar_x - 1.25, gameChar_y - 10)
    vertex(gameChar_x - 4.25, gameChar_y - 15)
    vertex(gameChar_x - 2.5, gameChar_y - 15)
    endShape(); 
 
    beginShape()
    vertex(gameChar_x - 1, gameChar_y - 47)
    vertex(gameChar_x , gameChar_y - 47)
    vertex(gameChar_x , gameChar_y - 35)
    vertex(gameChar_x - 5, gameChar_y - 35)
    vertex(gameChar_x - 5, gameChar_y - 37)
    vertex(gameChar_x - 1, gameChar_y - 37)
    endShape();
    
    
    fill(190, 0, 0)
    rect(gameChar_x - 4.5, gameChar_y - 10, 4, 2)
    rect(gameChar_x - 3.5, gameChar_y - 10, 4, 2)
    ellipse(gameChar_x - 3, gameChar_y - 7.5 , 1, 1)
    ellipse(gameChar_x - 1, gameChar_y - 7.5 , 1, 1)
    ellipse(gameChar_x - 2, gameChar_y - 7.5 , 1, 1)
    ellipse(gameChar_x - 1, gameChar_y - 7.5 , 1, 1)
    
    
    fill(255, 255, 51)
    ellipse(gameChar_x , gameChar_y - 62, 2, 5)
    
    
    fill(190, 0, 0)
    beginShape()
    vertex(gameChar_x - 1, gameChar_y - 65)
    vertex(gameChar_x -4 , gameChar_y - 60)
    vertex(gameChar_x -4 , gameChar_y - 55)
    vertex(gameChar_x - 1, gameChar_y - 60)
    endShape();
    
    fill(255,251,182)
    beginShape()
    vertex(gameChar_x , gameChar_y - 62)
    vertex(gameChar_x + 2, gameChar_y - 67)
    vertex(gameChar_x + 2, gameChar_y - 25)
    vertex(gameChar_x , gameChar_y - 25)
    vertex(gameChar_x , gameChar_y - 62)
    endShape();



	}
	else if(isRight)
	{
		// add your walking right code
    fill(255,218,185);
    ellipse(gameChar_x, gameChar_y - 60, 7, 17);
    triangle(gameChar_x - 1.5,gameChar_y - 55, gameChar_x, gameChar_y - 50, gameChar_x+1.5, gameChar_y - 55)
    rect(gameChar_x - 0.25, gameChar_y - 52, 1,5)
    
    
    fill(153, 0, 0);
    triangle(gameChar_x - 3.5, gameChar_y - 47, gameChar_x,gameChar_y - 25, gameChar_x + 3.5, gameChar_y - 47);
    triangle(gameChar_x - 3.5, gameChar_y - 15, gameChar_x, gameChar_y - 35, gameChar_x + 3.5, gameChar_y-15)
    
    fill(255,218,185)
    beginShape()
    vertex(gameChar_x + 2.5, gameChar_y - 18)
    vertex(gameChar_x + 7.5, gameChar_y - 18)
    vertex(gameChar_x + 2.5, gameChar_y - 11)
    vertex(gameChar_x + 1.25, gameChar_y - 11)
    vertex(gameChar_x + 4.25, gameChar_y - 16)
    vertex(gameChar_x + 2.5, gameChar_y - 16)
    endShape();
    
    beginShape()
    vertex(gameChar_x + 2.5, gameChar_y - 17)
    vertex(gameChar_x + 7.5, gameChar_y - 17)
    vertex(gameChar_x + 2.5, gameChar_y - 10)
    vertex(gameChar_x + 1.25, gameChar_y - 10)
    vertex(gameChar_x + 4.25, gameChar_y - 15)
    vertex(gameChar_x + 2.5, gameChar_y - 15)
    endShape(); 
    
    beginShape()
    vertex(gameChar_x + 1, gameChar_y - 47)
    vertex(gameChar_x , gameChar_y - 47)
    vertex(gameChar_x , gameChar_y - 35)
    vertex(gameChar_x + 5, gameChar_y - 35)
    vertex(gameChar_x + 5, gameChar_y - 37)
    vertex(gameChar_x + 1, gameChar_y - 37)
    endShape();
    
    
    fill(190, 0, 0)
    rect(gameChar_x , gameChar_y - 10, 4, 2)
    rect(gameChar_x + 0.5, gameChar_y - 10.5, 4, 2)
    ellipse(gameChar_x + 1, gameChar_y - 7.5 , 1, 1)
    ellipse(gameChar_x + 3, gameChar_y - 7.5 , 1, 1)
    ellipse(gameChar_x + 2, gameChar_y - 7.5 , 1, 1)
    ellipse(gameChar_x + 3 , gameChar_y - 7.5 , 1, 1)
    
    
    fill(255, 255, 51)
    ellipse(gameChar_x , gameChar_y - 62, 2, 5)
    
    
    fill(190, 0, 0)
    beginShape()
    vertex(gameChar_x + 4, gameChar_y - 55)
    vertex(gameChar_x + 1, gameChar_y - 60)
    vertex(gameChar_x +1, gameChar_y - 65)
    vertex(gameChar_x +4, gameChar_y - 60)
    endShape();
    rect(gameChar_x - 3, gameChar_y - 62.5, 4,2)
    
    
    fill(255,251,182)
    beginShape()
    vertex(gameChar_x , gameChar_y - 62)
    vertex(gameChar_x + 2, gameChar_y - 67)
    vertex(gameChar_x + 2, gameChar_y - 25)
    vertex(gameChar_x , gameChar_y - 25)
    vertex(gameChar_x , gameChar_y - 62)
    endShape();


	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
    fill(0);
    ellipse(gameChar_x - 5, gameChar_y - 60, 5, 5);
    ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5)
    
    fill(255,218,185);
    ellipse(gameChar_x, gameChar_y - 60, 17, 17);
    triangle(gameChar_x - 7,gameChar_y - 55, gameChar_x, gameChar_y - 50, gameChar_x+7, gameChar_y - 55)
    rect(gameChar_x- 1.5, gameChar_y - 52, 3,5)
    
    
    fill(153, 0, 0);
    triangle(gameChar_x - 7.5, gameChar_y - 47, gameChar_x,gameChar_y - 25, gameChar_x + 7.5, gameChar_y - 47);
    triangle(gameChar_x - 7.5, gameChar_y - 15, gameChar_x, gameChar_y - 35, gameChar_x + 7.5, gameChar_y-15)
    
    fill(255,218,185)
    rect(gameChar_x - 5, gameChar_y - 15, 2.5, 10)
    rect(gameChar_x + 3.5, gameChar_y - 15, 2.5, 10)
    rect(gameChar_x + 7, gameChar_y - 60, 2.5, 15)
    rect(gameChar_x - 9, gameChar_y - 60, 2.5, 15)
    
    fill(190, 0, 0)
    rect(gameChar_x - 6.5, gameChar_y - 5, 4, 2)
    rect(gameChar_x + 3.5, gameChar_y - 5, 4, 2)
   
    
    fill(255, 255, 51)
    ellipse(gameChar_x + 8, gameChar_y - 62, 2, 5)
    ellipse(gameChar_x - 8, gameChar_y - 62, 2, 5)
    
    fill(190, 0, 0)
    beginShape()
    vertex(gameChar_x -8, gameChar_y - 65)
    vertex(gameChar_x , gameChar_y - 60)
    vertex(gameChar_x , gameChar_y - 55)
    vertex(gameChar_x - 8, gameChar_y - 60)
    endShape();
    
    beginShape()
    vertex(gameChar_x + 8, gameChar_y - 65)
    vertex(gameChar_x  , gameChar_y - 60)
    vertex(gameChar_x  , gameChar_y - 55)
    vertex(gameChar_x + 8, gameChar_y - 60)
    endShape();
    
    fill(255,251,182)
    beginShape()
    vertex(gameChar_x + 8, gameChar_y - 62)
    vertex(gameChar_x + 12, gameChar_y - 67)
    vertex(gameChar_x + 12, gameChar_y - 25)
    vertex(gameChar_x + 10, gameChar_y - 25)
    vertex(gameChar_x + 10, gameChar_y - 62)
    endShape();
    
    beginShape()
    vertex(gameChar_x - 8, gameChar_y - 62)
    vertex(gameChar_x - 12, gameChar_y - 67)
    vertex(gameChar_x - 12, gameChar_y - 25)
    vertex(gameChar_x - 10, gameChar_y - 25)
    vertex(gameChar_x - 10, gameChar_y - 62)
    endShape();
    
    fill(190,0,0)
    triangle(gameChar_x - 5.5, gameChar_y - 2.5, gameChar_x - 4.5, gameChar_y - 4.25, gameChar_x - 3.5, gameChar_y - 2.5)
    triangle(gameChar_x + 6.5, gameChar_y - 2.5, gameChar_x + 5.5, gameChar_y - 4.25, gameChar_x + 4.5, gameChar_y - 2.5)
    fill(255,0,0)
    triangle(gameChar_x - 5.5, gameChar_y - 2.5, gameChar_x - 4.5, gameChar_y + 5, gameChar_x - 3.5, gameChar_y - 2.5)
    triangle(gameChar_x + 6.5, gameChar_y - 2.5, gameChar_x + 5.5, gameChar_y + 5, gameChar_x + 4.5, gameChar_y - 2.5)


	}else
	{
		// add your standing front facing code
        
    fill(255,218,185);
    ellipse(gameChar_x, gameChar_y - 60, 17, 17);
    triangle(gameChar_x - 7,gameChar_y - 55, gameChar_x, gameChar_y - 50, gameChar_x+7, gameChar_y - 55)
    rect(gameChar_x- 1.5, gameChar_y - 52, 3,5)
    
    
    fill(153, 0, 0);
    triangle(gameChar_x - 7.5, gameChar_y - 47, gameChar_x,gameChar_y - 25, gameChar_x + 7.5, gameChar_y - 47);
    triangle(gameChar_x - 7.5, gameChar_y - 15, gameChar_x, gameChar_y - 35, gameChar_x + 7.5, gameChar_y-15)
    
    fill(255,218,185)
    rect(gameChar_x - 5, gameChar_y - 15, 2.5, 10)
    rect(gameChar_x + 3.5, gameChar_y - 15, 2.5, 10)
    rect(gameChar_x + 7, gameChar_y - 47, 2.5, 15)
    rect(gameChar_x - 9, gameChar_y - 47, 2.5, 15)
    
    fill(190, 0, 0)
    rect(gameChar_x - 6.5, gameChar_y - 5, 4, 2)
    rect(gameChar_x + 3.5, gameChar_y - 5, 4, 2)
    ellipse(gameChar_x - 5, gameChar_y - 2.5 , 1, 1)
    ellipse(gameChar_x - 3, gameChar_y - 2.5 , 1, 1)
    ellipse(gameChar_x + 4, gameChar_y - 2.5 , 1, 1)
    ellipse(gameChar_x + 6, gameChar_y - 2.5 , 1, 1)
    
    fill(255, 255, 51)
    ellipse(gameChar_x + 8, gameChar_y - 62, 2, 5)
    ellipse(gameChar_x - 8, gameChar_y - 62, 2, 5)
    
    fill(190, 0, 0)
    beginShape()
    vertex(gameChar_x -8, gameChar_y - 65)
    vertex(gameChar_x , gameChar_y - 60)
    vertex(gameChar_x , gameChar_y - 55)
    vertex(gameChar_x - 8, gameChar_y - 60)
    endShape();
    
    beginShape()
    vertex(gameChar_x + 8, gameChar_y - 65)
    vertex(gameChar_x  , gameChar_y - 60)
    vertex(gameChar_x  , gameChar_y - 55)
    vertex(gameChar_x + 8, gameChar_y - 60)
    endShape();
    
    fill(255,251,182)
    beginShape()
    vertex(gameChar_x + 8, gameChar_y - 62)
    vertex(gameChar_x + 12, gameChar_y - 67)
    vertex(gameChar_x + 12, gameChar_y - 25)
    vertex(gameChar_x + 10, gameChar_y - 25)
    vertex(gameChar_x + 10, gameChar_y - 62)
    endShape();
    
    beginShape()
    vertex(gameChar_x - 8, gameChar_y - 62)
    vertex(gameChar_x - 12, gameChar_y - 67)
    vertex(gameChar_x - 12, gameChar_y - 25)
    vertex(gameChar_x - 10, gameChar_y - 25)
    vertex(gameChar_x - 10, gameChar_y - 62)
    endShape();

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i =0;i<clouds.length;i++){
    noStroke();
	fill(123, 138, 147, 250);
    ellipse(clouds[i].pos_x, clouds[i].pos_y, 120, 90);
    ellipse(clouds[i].pos_x - 50, clouds[i].pos_y,100, 60);
    ellipse(clouds[i].pos_x+ 50, clouds[i].pos_y, 100, 60);   
    
    ellipse(clouds[i].pos_x + 500, clouds[i].pos_y, 120, 90);
    ellipse(clouds[i].pos_x + 450, clouds[i].pos_y, 80, 60);
    ellipse(clouds[i].pos_x + 550, clouds[i].pos_y, 80, 60);
    clouds[i].pos_x += 1.0
    if(clouds[i].pos_x > width*3){
        clouds[i].pos_x = -1600
    }
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i =0; i<mountains.length;i++)
  {
    noStroke();
    fill(85, 65, 36);
    triangle(mountains[i].x, mountains[i].y, mountains[i].x1, mountains[i].y1, mountains[i].x2 , mountains[i].y2);
      
  };
    for(var i =0; i<mountains2.length;i++)
    {
      noStroke();
      fill(255, 255, 255);
      triangle(mountains2[i].x ,mountains2[i].y, mountains2[i].x1, mountains2[i].y1, mountains2[i].x2, mountains2[i].y2);
    };
    
}
// Function to draw trees objects.
function drawTrees()
{
  for(var i = 0; i<trees_x.length;i++)
  {
    noStroke();
    fill(160, 82, 45);
    rect(trees_x[i]+12 , treePos_y - 5, 40, 150);
	noStroke();
    fill(58, 95, 11);
    triangle(trees_x[i] - 50,treePos_y , trees_x[i] + 30, treePos_y - 105, trees_x[i] + 110, treePos_y);
    fill(58, 95, 11);	
    triangle(trees_x[i] - 50, treePos_y - 50, trees_x[i] + 30, treePos_y - 155, trees_x[i] + 110, treePos_y - 50);
  }  
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------




// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill (19,24,98);
    rect (t_canyon.x,floorPos_y, 490,490);
    noStroke();
	fill(107,142,35, 200);
    quad(t_canyon.x, t_canyon.y+148, t_canyon.x , t_canyon.y, t_canyon.x + 70, t_canyon.y, t_canyon.x + 160, t_canyon.y+ 148);
    quad(t_canyon.x,t_canyon.y+148,t_canyon.x, t_canyon.y + 18,t_canyon.x  + 120, t_canyon.y + 18, t_canyon.x+ 180, t_canyon.y + 148);
    quad(t_canyon.x,t_canyon.y+148,t_canyon.x, t_canyon.y + 38,t_canyon.x  + 160, t_canyon.y + 38, t_canyon.x+ 200, t_canyon.y + 148);
    
    quad(t_canyon.x+240, t_canyon.y+148, t_canyon.x + 400, t_canyon.y-2,t_canyon.x+490, t_canyon.y-2,t_canyon.x+490, t_canyon.y+148)
    quad(t_canyon.x+240,t_canyon.y+148,t_canyon.x + 350,t_canyon.y + 18,t_canyon.x+490,t_canyon.y + 18,t_canyon.x+490, t_canyon.y+148)
    quad(t_canyon.x+240,t_canyon.y+148,t_canyon.x + 310,t_canyon.y + 38,t_canyon.x+490,t_canyon.y + 38,t_canyon.x+490, t_canyon.y+148)
 
        
}
// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if((gameChar_world_x > t_canyon.x+ t_canyon.width && gameChar_y==floorPos_y )&&(gameChar_world_x < t_canyon.x +t_canyon.width2 && gameChar_y==floorPos_y))
        {
           isPlummeting = true; 
        }
   
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    for(var i = 0; i < 3; i++)
    {
    fill(0)
    rect(t_collectable.x + 17, t_collectable.y - 28 + i*2, 35, 1)
    fill(255,255,0)
    rect(t_collectable.x + 55, t_collectable.y - 28 + i*2, 5, 1)
    }
    fill(0)
    rect(t_collectable.x + 47, t_collectable.y - 29, 1, 7)
    rect(t_collectable.x - 12, t_collectable.y - 37, 16,15)
    fill(119,136,153)
    rect(t_collectable.x - 15, t_collectable.y - 32, 22,15)
    rect(t_collectable.x - 3, t_collectable.y - 30, 40,10)
    
    
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
     if(dist(gameChar_world_x,gameChar_y,t_collectable.x,t_collectable.y)<60)
    {
       t_collectable.isFound = true; 
       
        game_score +=1;
    }   
}
//cacti
function drawCacti(t_cacti)
{
            
    fill(23, 114, 69)
    ellipse(t_cacti.x,t_cacti.y,t_cacti.size,t_cacti.size)
    rect(t_cacti.x - 15, t_cacti.y,t_cacti.size, t_cacti.height)
    beginShape()
    vertex(t_cacti.x + 15,t_cacti.y + 10)
    vertex(t_cacti.x + 25, t_cacti.y + 10)
    vertex(t_cacti.x + 25, t_cacti.y - 5)
    vertex(t_cacti.x + 30,t_cacti.y - 5)
    vertex(t_cacti.x + 30,t_cacti.y + 15)
    vertex(t_cacti.x + 15,t_cacti.y + 15)
    endShape();
    ellipse(t_cacti.x + 27.5, t_cacti.y - 5, 5, 5)
            
    beginShape()
    vertex(t_cacti.x - 15,t_cacti.y + 20)
    vertex(t_cacti.x - 25, t_cacti.y + 20)
    vertex(t_cacti.x - 25, t_cacti.y + 5)
    vertex(t_cacti.x - 30,t_cacti.y + 5)
    vertex(t_cacti.x - 30,t_cacti.y + 25)
    vertex(t_cacti.x - 15,t_cacti.y + 25)
    endShape();
    ellipse(t_cacti.x - 27.5, t_cacti.y + 5, 5, 5)
    fill(180, 0, 0)
    ellipse(t_cacti.x-3, t_cacti.y, t_cacti.size-20,t_cacti.size-22)
    ellipse(t_cacti.x+3, t_cacti.y, t_cacti.size-20,t_cacti.size-22)
    triangle(t_cacti.x+8.5,t_cacti.y,t_cacti.x-8.5,t_cacti.y,t_cacti.x,t_cacti.y+12)
}

function CheckCacti(t_cacti)
{
    if(dist(gameChar_world_x,gameChar_y,t_cacti.x,t_cacti.y)<60)
    {
       t_cacti.isFound = true; 
       
        lives +=1;
    }   
}
function checkRisingOrFalling()
{
    if(isPlummeting==true)
    {
        gameChar_y +=10;
    }else{
        if(isFalling==true){
            if(gameChar_y<floorPos_y){
                gameChar_y += 1;
            }else{
                isFalling = false;
            }
        }
    }
}

function createPlatforms(x,y,length)
{
    var p = {
        
        x:x,
        y:y,
        length:length,
        draw:function(){
            fill(156,156,156)
            rect(this.x,this.y,this.length,10)
            triangle(this.x, this.y +10, this.x+12.5,this.y+20,this.x+25,this.y+10)
            triangle(this.x+25, this.y+10, this.x+50, this.y+50,this.x+75, this.y+10)
            triangle(this.x+75, this.y+10, this.x+87.5, this.y+20, this.x+100, this.y+10)
        }, 
        // Changed this part from checkContact to checkContactPlatform so it does not conflict with the enemies checkContact
        checkContactPlatform:function(gc_x,gc_y)
        {
            
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                // Changed - this is the error that you spotted where this.x was included in the calculations
                var d = this.y - gc_y;
                if(d >= 0 && d < 15)
                    console.log(d);
                {
                    return true;
                }
            }return false;
        }
    };
    return p;
}


function Enemy(x,y,range,size)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.size = size;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -2
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    this.draw = function()
    {
    this.update();
    fill(147,120,81)
    stroke(0)
    triangle(this.currentX - 25, this.y - 77, this.currentX, this.y - 52, this.currentX + 25, this.y - 77)
    rect(this.currentX - 2.5, this.y - 55, 5, 10)
    rect(this.currentX + 11.5, this.y - 43.5, 12.5, 3.5)
    rect(this.currentX - 25, this.y - 43.5, 12.5, 3.5)
    beginShape();
    vertex(this.currentX + 24, this.y - 43);
    vertex(this.currentX + 27, this.y - 47);
    vertex(this.currentX + 30, this.y - 43);
    vertex(this.currentX + 29, this.y - 41);
    vertex(this.currentX + 27, this.y - 44);
    vertex(this.currentX + 25, this.y - 41)
    endShape();
    
    beginShape();
    vertex(this.currentX + 24, this.y - 40.5);
    vertex(this.currentX + 27, this.y - 36.5);
    vertex(this.currentX + 29, this.y - 40.5);
    vertex(this.currentX + 30, this.y - 38.5);
    vertex(this.currentX + 27, this.y - 34.5);
    vertex(this.currentX + 23, this.y - 38.5);
    endShape();
    
    beginShape();
    vertex(this.currentX - 29, this.y - 43);
    vertex(this.currentX - 26, this.y - 47);
    vertex(this.currentX - 23, this.y - 43);
    vertex(this.currentX - 24, this.y - 41);
    vertex(this.currentX - 26, this.y - 44);
    vertex(this.currentX - 28, this.y - 41)
    endShape();
    
    beginShape();
    vertex(this.currentX - 29, this.y - 40.5);
    vertex(this.currentX - 26, this.y - 36.5);
    vertex(this.currentX - 24, this.y - 40.5);
    vertex(this.currentX - 23, this.y - 38.5);
    vertex(this.currentX - 26, this.y - 34.5);
    vertex(this.currentX - 28, this.y - 38.5);
    endShape(); 
    
    fill(128,128,0);
    triangle(this.currentX - 17,this.y - 72,this.currentX,this.y - 57,this.currentX + 17, this.y - 72);
    noStroke();
    ellipse(this.currentX,this.y - 22, 20, 20)
    stroke(0)
    quad(this.currentX - 15, this.y - 47, this.currentX - 22.5, this.y - 22, this.currentX + 22.5, this.y - 22, this.currentX + 15, this.y - 47 );
   
    
    fill(107,142,35)
    quad(this.currentX - 11.5, this.y - 67, this.currentX - 5.5, this.y - 62, this.currentX + 6, this.y - 62, this.currentX + 11, 
    this.y - 67)
    noStroke()
    fill(255, 0, 0)
    ellipse(this.currentX, this.y - 64.5, this.size, this.size)
    } 
    this.checkContact = function(gc_x,gc_y)
    {
        var d = dist(gc_x,gc_y,this.currentX,  this.y)
        if(d < 55)
        {
            return true;
          
        };
        return false;
    }
}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos,floorPos_y,flagpole.x_pos, floorPos_y-150);
    
    fill(52, 165, 111);
    stroke(255, 255,51);
    
    
    if(flagpole.isReached)
    {
        triangle(flagpole.x_pos, floorPos_y - 150, flagpole.x_pos + 50, floorPos_y - 125, flagpole.x_pos, floorPos_y - 100)
    }
    else
    {
        triangle(flagpole.x_pos, floorPos_y - 50, flagpole.x_pos + 50, floorPos_y - 25, flagpole.x_pos, floorPos_y )
    }
    
    pop();
}
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos)
    
    if(d<15)
    {
        flagpole.isReached = true;
    }
    
}

function checkPlayerDie()
{
    if(gameChar_y > height)
    {
        lives -=1;  
        if(lives>0)
        {
            startGame();
            
        }else if(lives = 0)
        {
            for(var i =0; i<3; i++)
           {
               lives = lives + i
           } 
        }
    }
   
}

function checkVictoryOrLost()
{

    if(lives == 0)
    {
        BackgroundSound.stop();
        gameover.loop();

    }

    if(flagpole.isReached == true)
    {
        BackgroundSound.stop();
        victorySound.play();
    }

}



    
function drawBolders()
{
    for(var i = 0; i<bolders.length;i++)
    {
    fill(112, 72, 60)
    noStroke();
    beginShape()
    vertex(bolders[i].x, bolders[i].y)
    vertex(bolders[i].x + 200, bolders[i].y)
    vertex(bolders[i].x +400, bolders[i].y)
    vertex(bolders[i].x + 350, bolders[i].y - 30)
    vertex(bolders[i].x + 200, bolders[i].y - 80)
    vertex(bolders[i].x + 50, bolders[i].y - 30 )
    endShape();
    
    beginShape()
    vertex(bolders[i].x - 450, bolders[i].y - 255)
    vertex(bolders[i].x - 150, bolders[i].y - 130)
    vertex(bolders[i].x + 200, bolders[i].y - 80)
    vertex(bolders[i].x + 550, bolders[i].y - 130)
    vertex(bolders[i].x + 900, bolders[i].y - 255)
    endShape();
    
    fill(219, 228, 235)
    noStroke()
    rect(bolders[i].x - 450 , bolders[i].y - 265, 1350, 10) 
    }
}



function startGame()
{
    BackgroundSound.loop();
    victorySound.stop();
    gameover.stop();
    
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    

	// Initialise arrays of scenery objects.
    
    //draw trees
    trees_x=[ -3000,-2000,-2100,-1700, -1000,-820, -310,100, 300, 500, 1000, 1700, 1900,2500,2900,3200];
    treePos_y = height/2;
    // draw clouds
    //initialise clouds
    clouds=[
        {pos_x:100, pos_y:200},
        {pos_x:600, pos_y:100},
        {pos_x:800, pos_y:200},
        {pos_x:-400, pos_y:100},
        {pos_x:-850, pos_y:200},
        {pos_x:-1400, pos_y:100}
        ];
    //draw mountains
    //Initialise mountains
    mountains = [{x: 75,y: floorPos_y, x1:250, y1: 180, x2:425, y2: floorPos_y},
                 {x: 0,y: floorPos_y,x1: 100,y1: 255, x2: 250, y2: floorPos_y},
                 {x: 250,y: floorPos_y, x1: 375, y1: 255, x2: 480, y2: floorPos_y},
                 
                 {x: -725,y: floorPos_y, x1:-550, y1: 180, x2:-375, y2: floorPos_y},
                 {x: -800,y: floorPos_y,x1: -700,y1: 255, x2: -550, y2: floorPos_y},
                 {x: -550,y: floorPos_y, x1: -375 , y1: 255, x2: -320, y2: floorPos_y}
                ];
    mountains2 = [{x: 230,y: floorPos_y - 222, x1:250, y1: 180, x2:270, y2: floorPos_y-222},
                 {x: 80,y: floorPos_y - 140, x1:100, y1: 255, x2:130 , y2: floorPos_y - 140},
                 {x: 350,y: floorPos_y - 140, x1:375, y1: 255, x2:397 , y2: floorPos_y - 140},
                  
                 {x: -570,y: floorPos_y - 222, x1:-550, y1: 180, x2:-530, y2: floorPos_y-222},
                 {x: -720,y: floorPos_y - 140, x1:-700, y1: 255, x2:-670 , y2: floorPos_y - 140},
                 {x: -410,y: floorPos_y - 140, x1:-375, y1: 255, x2:-363 , y2: floorPos_y - 140}
                 ];
    
 //draw canyons
    canyon = [{x:576, y:432, width: 160, width2:280},
             {x:1200,y:432, width:160,width2:280},
             {x: 2500, y: 432,width:160,width2:280},
             {x: -1500, y: 432,width:160,width2:280}
             ];
    
//draw collectables
     collectables=[{x:300, y:342, width:30, height:30, isFound:false},
                  {x:600, y:342, width:30, height:30, isFound:false},
                  {x:900, y:342, width:30, height:30, isFound:false},
                  {x:1100, y:342, width:30, height:30, isFound:false},
                  {x:1200, y:342, width:30, height:30, isFound:false},
                  {x:-300, y:342, width:30, height:30, isFound:false},
                  {x:-400, y:302, width:30, height:30, isFound:false},
                  {x:-600, y:342, width:30, height:30, isFound:false},
                  {x:-670, y:332, width:30, height:30, isFound:false}
                 ];

    platforms = [];
    platforms.push(createPlatforms(-1300,floorPos_y - 100, 100))
    platforms.push(createPlatforms(750,floorPos_y - 100, 100))
    platforms.push(createPlatforms(1350,floorPos_y - 100, 100))
    platforms.push(createPlatforms(2700,floorPos_y - 100, 100))
  
  

    enemies = [];
    enemies.push(new Enemy(-400, floorPos_y ,100, 5));
    enemies.push(new Enemy(300, floorPos_y ,100, 5));
    enemies.push(new Enemy(1400, floorPos_y ,100, 5));
    enemies.push(new Enemy(1900, floorPos_y ,100, 5));
    enemies.push(new Enemy(2400, floorPos_y ,100, 5));
    enemies.push(new Enemy(3000, floorPos_y ,100, 5));
    
    bolders = [
               {x:-2500, y:floorPos_y},
               {x: 4000, y:floorPos_y}
              ]
    
    cacti = [{x:-600, y:floorPos_y - 50, size:30, height:50, isFound:false},
              {x:50, y:floorPos_y - 50, size:30, height:50,isFound: false},
              {x:550, y:floorPos_y - 50, size:30, height:50,isFound:false},
              {x:1250, y:floorPos_y - 50, size: 30,height:50, isFound: false},
              {x:2150, y:floorPos_y - 50, size: 30,height:50, isFound: false},
              {x:2350, y:floorPos_y - 50, size: 30,height:50, isFound: false}]
    
}
