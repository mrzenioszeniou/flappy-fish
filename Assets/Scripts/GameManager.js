#pragma strict

import System.Collections.Generic;


private var obstaclesList  = new List.<Transform>();
private var powerUpList = new List.<Transform>();
internal static var state : int = 0;
var obstacle1 : Transform;
var obstacle2 : Transform;
var obstacle3 : Transform;
var obstacle4 : Transform;
var obstacle5 : Transform;
var PlayerObj : Player;
var messageSkin : GUISkin;
var liveSkin : GUISkin;
var instructionSkin : GUISkin;
var mainCamera : Camera;
var restartKey : KeyCode;
var lifeTex  : Texture;
var ghostTex : Texture;
var nitroTex : Texture;
var powerUpInterval : float;
static var obstacleInterval : float = 2.6;
private var obstacleTimer : float = powerUpInterval*2;
private var powerUpTimer : float = 0;
var extraLife : Transform;
var ghost : Transform;
var nitro : Transform;
internal static var score : int = 0;
static var speed : float = -2.5;
internal static var cntr : int;
private static var started : boolean = false;


function Update () {

	if (score/10 > cntr)//speed ups the obstacles as the player's score increases. We adjust obstacle generation interval to make sure they won't hit each other
	{
		cntr++;
		speed=speed*1.1;
		obstacleInterval=obstacleInterval/1.1;
	}

	switch (state){

		case 0://In this case the program is at the starting phase,
			   //awaiting for player's input to commence the game.
			if (Input.GetKey(restartKey))
			{ state = 1;
			  audio.Play();}
			break;
			
		case 1: //In this case the game has commenced.
				//If the player has no lives,move to phase 2.
			if (Player.life<1)//The player lost										
			{ 		
				audio.Stop();//Reset the variables required to commence the game again
		  		state = 2;
				Application.LoadLevel(0);
				PlayerObj.rigidbody2D.gravityScale = 0f;
		  		
			}
			else//The player is currently playing
			{ 	
			    //Check that player is within boundaries.
			    var playerPosition:float = mainCamera.WorldToScreenPoint(PlayerObj.transform.position).y;
				if (playerPosition > Screen.height+20 || playerPosition < -20)
				{ 	Player.life--;
				    if (Player.life>0)
				  	{ 
				  		audio.Stop();
			  			state = 0;
			  			started = true; 
						Application.LoadLevel(0);
						PlayerObj.rigidbody2D.gravityScale = 0f;
			  		}
				 	
				    else//The player lost all his lives
				    { 
			  			audio.Stop();
				  		state = 2;
					}
					Application.LoadLevel(0);
					PlayerObj.rigidbody2D.gravityScale = 0f;
				}
				
			   //Obstacle Creation Control.		
			   obstacleTimer += Time.deltaTime;						
			   if (obstacleTimer>=obstacleInterval)
			   {	
			   		CreateObstacle(); 
			    	obstacleTimer = obstacleTimer % obstacleInterval;
			    }
			   
			   //PowerUp Creation Control.
			   if (!PlayerObj.nitroIsActive)//we don't create Power Ups if nitro is active
			   {
			   powerUpTimer += Time.deltaTime;						
			   		if (powerUpTimer>powerUpInterval)
			   		{
			   			CreatePowerUp();
			   			powerUpTimer= powerUpTimer % powerUpInterval;
			   		}
			   }
			}
			break;
			
		case 2://In this case the player has lost.Game Over and awaiting restart button.
			if (Input.GetKey(restartKey))
			{	Player.life = 3;
		  		Player.ghost = 0;
		  		Player.nitro = 0;
		  		speed =  -2.5;
		  		obstacleInterval = 2.5;
				state = 0;
				score = 0;
				started = false;
			 	Application.LoadLevel(0); 
			 }
			break;
			
		default:
			Debug.Log("No such state exists : GameManager.state = " + state);
			break;
		
		}
}

function OnGUI ()
{	
	switch(state){
		case 0:
		//the game is waiting for the player to press start. We also inform the player about the game's controls and powerups.
			// display message 
			GUI.skin = messageSkin;      
        	GUI.color = Color.white;    
        	GUI.Label (Rect (Screen.width / 2 - 200 , Screen.height * 0.2f , 500 , 100), "Press Space to Start");
        	   if ((Player.life==3) && !started)//display instructions
        	   {
		        	GUI.skin = instructionSkin;//skin with same font, different size
		        	GUI.Label (Rect (Screen.width / 2 - 200 , Screen.height * 0.4f , 50, 50), lifeTex);
		        	GUI.Label (Rect (Screen.width / 2 - 150 , Screen.height * 0.4f , 500 , 50), " Gives an extra life");
		        	GUI.Label (Rect (Screen.width / 2 - 200 , Screen.height * 0.6f - 10 , 50, 50), ghostTex);
		        	GUI.Label (Rect (Screen.width / 2 - 150 , Screen.height * 0.6f , 500 , 50), " Move through rocks. Turn it on by pressing C. Lasts 5 seconds");
		       		GUI.Label (Rect (Screen.width / 2 - 200 , Screen.height * 0.8f - 10, 50, 50), nitroTex);
		       		GUI.Label (Rect (Screen.width / 2 - 150 , Screen.height * 0.8f , 500 , 50), " Be unstoppable! Turn it on by pressing V. Lasts 5 seconds");
		       		
		       }
        	break;
	    case 1:
	    // the player is currently playing
	    	//display score, lives, ghosts 
		    GUILayout.BeginVertical("label",GUILayout.Width(100),GUILayout.Height(500));
			    GUI.skin = liveSkin;
			    //display score
			    GUILayout.BeginHorizontal ("label");
			    	GUILayout.Label("Score: " + score, GUILayout.Height(30),GUILayout.Width(100));
			    GUILayout.EndHorizontal();
			    //display life
			    GUILayout.BeginHorizontal ("label");
			    	GUILayout.Label(lifeTex,GUILayout.Height(30),GUILayout.Width(30) );
					GUILayout.Label ("X " + Player.life,GUILayout.Height(30),GUILayout.Width(40));
				GUILayout.EndHorizontal();
				//display ghost
				GUILayout.BeginHorizontal ("label");
					GUILayout.Label(ghostTex,GUILayout.Height(30),GUILayout.Width(30));
					GUILayout.Label ("X "+Player.ghost,GUILayout.Height(30),GUILayout.Width(40));
				GUILayout.EndHorizontal ();
				GUILayout.BeginHorizontal ("label");
					GUILayout.Label(nitroTex,GUILayout.Height(30),GUILayout.Width(30));
					GUILayout.Label ("X "+Player.nitro,GUILayout.Height(30),GUILayout.Width(40));
				GUILayout.EndHorizontal ();
			GUILayout.EndVertical();
			break;
		case 2:
		//the player lost
			GUI.skin = messageSkin; 
			GUI.color = Color.red;    
	        GUI.Label (Rect (Screen.width / 2 - 70, 50, 200, 175), "YOU LOST");
	        GUI.color = Color.white;
	        GUI.Label (Rect (Screen.width / 2 - 200 , 100 ,500 , 500), "Press Space to restart");
	        GUI.color = Color.black;
	        GUI.Label(Rect (Screen.width / 2 - 70, 150, 200, 175), "Score: " + score);
	        break;
	}
}


function CreateObstacle()//Creates an obstacle and gives it speed
{
	var obstacle=randomObstacle();
	var instanceObstancle = Instantiate(obstacle);
	instanceObstancle.rigidbody2D.velocity.x = speed;		
}
	
function randomObstacle() {//Returns a random obstacle from the bag(list)

    if (obstaclesList.Count == 0){//If the bag is empty we add the prefabs again.We add them twice for randomness
			obstaclesList.Add(obstacle1);
			obstaclesList.Add(obstacle2);
			obstaclesList.Add(obstacle3);
			obstaclesList.Add(obstacle4);
			obstaclesList.Add(obstacle5);
			obstaclesList.Add(obstacle1);
			obstaclesList.Add(obstacle2);
			obstaclesList.Add(obstacle3);
			obstaclesList.Add(obstacle4);
			obstaclesList.Add(obstacle5);
		}	
	var tempIndex=Mathf.Round(Random.Range(0, obstaclesList.Count-1));
	var next=obstaclesList[tempIndex];
	obstaclesList.RemoveAt(tempIndex);
  	return (next);
}; 

function CreatePowerUp() {//Creates a power up and gives it speed. We make sure that power-ups are faster than obstacles by giving them bigger speed
	var powerUp=randomPowerUp();
	var instancePowerUp = Instantiate(powerUp);
	instancePowerUp.rigidbody2D.velocity.x=speed-1;
}

function randomPowerUp() {

    if (powerUpList.Count == 0){//If the bag is empty we add the power-ups. We add nitro only once cause it's the best one!
			powerUpList.Add(extraLife);
			powerUpList.Add(ghost);
			powerUpList.Add(extraLife);
			powerUpList.Add(ghost);
			powerUpList.Add(nitro);
		}	
	var tempIndex=Mathf.Round(Random.Range(0, powerUpList.Count-1));
	var next = powerUpList[tempIndex];
	powerUpList.RemoveAt(tempIndex);
	
  return (next);
}; 