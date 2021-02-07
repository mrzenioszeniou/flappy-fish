#pragma strict

var obstacles : GameObject[];

var normalSprite : Sprite;
var jumpingSprite : Sprite;
var ouchSprite : Sprite;
var ghostSprite : Sprite;
var ghostJumpingSprite : Sprite;
var nitroSprite : Sprite;

var repeatingSource : AudioSource; 
var singleSource : AudioSource; 

var ouchSound :AudioClip;
var powerSound : AudioClip;
var nitroSound : AudioClip;
var ghostSound : AudioClip;
var wareOffSound : AudioClip;    
            
var jumpKey : KeyCode;
var ghostKey : KeyCode;
var nitroKey : KeyCode;
var mainCamera : Camera;
var velocity : float = 5;
internal static var life = 3;
internal static var ghost = 0;
internal static var nitro = 0;
private  var ghostIsActive:boolean = false;
internal var nitroIsActive:boolean = false;
private var ouch : boolean = false;
var ghostDuration: float = 5;
var nitroDuration: float = 5;
var backgroundObj : GameObject;

function Start () {//Setting the player place based on the background
	transform.position.x = (backgroundObj.renderer.bounds.min.x - backgroundObj.renderer.bounds.center.x)*0.35f ;
	transform.position.y = 0f;
	rigidbody2D.gravityScale = 0f;
	
}

function Update () {
	
	if ((ouch)&&(!nitroIsActive)){
		GetComponent(SpriteRenderer).sprite = ouchSprite;
	}

	//player Controls
	if ((GameManager.state==1)  && (!nitroIsActive))
	{	rigidbody2D.gravityScale = 2f;
		if (Input.GetKey(jumpKey))
		{
			rigidbody2D.velocity.y = velocity;
		 	ResetSprite();
		}
	}

	//player enabled the ghost power
	if (Input.GetKey(ghostKey) && (ghost >0) && (!ghostIsActive) && (!nitroIsActive) && (GameManager.state == 1))
	{
		 ghost--;
	     ghostIsActive = true;
		 ResetGhost();
	}
		 
		//player enabled the nitro power
	if (Input.GetKey(nitroKey) && (nitro>0) && (!ghostIsActive) && (!nitroIsActive)&& (GameManager.state == 1))
	{	
		rigidbody2D.isKinematic = true;
		nitro--;
		nitroIsActive = true;
		ObstaclesSpeedUp();
		GameManager.speed = 4*GameManager.speed;
		GameManager.obstacleInterval = GameManager.obstacleInterval/4f;
		ResetNitro();
	}
}

function ObstaclesSpeedUp(){//finds all obstacles and speeds them up. Used for nitro.
 
    obstacles =  GameObject.FindGameObjectsWithTag ("ObstacleUp");
 
    for(var i = 0 ; i < obstacles.length ; i ++)
        {
        	obstacles[i].rigidbody2D.velocity.x = 4*obstacles[i].rigidbody2D.velocity.x;
        }
    obstacles =  GameObject.FindGameObjectsWithTag ("ObstacleDown");
 
    for( i = 0 ; i < obstacles.length ; i ++)
        {
          obstacles[i].rigidbody2D.velocity.x = 4*obstacles[i].rigidbody2D.velocity.x;
        }
        
    obstacles =  GameObject.FindGameObjectsWithTag ("Obstacle");
 
    for( i = 0 ; i < obstacles.length ; i ++)
        {
          obstacles[i].rigidbody2D.velocity.x = 4*obstacles[i].rigidbody2D.velocity.x;
        }    
 
}

function ObstaclesSpeedDown(){//finds all obstacles and speeds them down. Used for nitro.
 
    obstacles =  GameObject.FindGameObjectsWithTag ("ObstacleUp");
 
    for(var i = 0 ; i < obstacles.length ; i ++)
        {
          obstacles[i].rigidbody2D.velocity.x = obstacles[i].rigidbody2D.velocity.x/4f;
        }
        
    obstacles =  GameObject.FindGameObjectsWithTag ("ObstacleDown");
 
    for(i = 0 ; i < obstacles.length ; i ++)
        {
          obstacles[i].rigidbody2D.velocity.x = obstacles[i].rigidbody2D.velocity.x/4f;
        }

    obstacles =  GameObject.FindGameObjectsWithTag ("Obstacle");
 
    for( i = 0 ; i < obstacles.length ; i ++)
        {
          obstacles[i].rigidbody2D.velocity.x = obstacles[i].rigidbody2D.velocity.x/4f;
        } 
}

function ResetNitro(){
	  
	repeatingSource.clip = nitroSound;
	repeatingSource.Play();
	GetComponent(SpriteRenderer).sprite = nitroSprite;
	yield WaitForSeconds(nitroDuration-0.2);
	GameManager.speed = GameManager.speed/4f;
	GameManager.obstacleInterval = GameManager.obstacleInterval*4f;
	ObstaclesSpeedDown();
	singleSource.clip = wareOffSound;
	singleSource.Play();
	repeatingSource.Stop();
	GetComponent(SpriteRenderer).sprite = normalSprite ;
	yield WaitForSeconds(0.2);
	rigidbody2D.isKinematic = false;
	nitroIsActive = false;
}

function ResetGhost(){
	renderer.material.color.a = 0.5f;//making the fish transparent
	GetComponent(SpriteRenderer).sprite = ghostSprite;
	repeatingSource.clip = ghostSound;
	repeatingSource.Play();
	yield WaitForSeconds(ghostDuration);
	repeatingSource.Stop();
	ghostIsActive = false;
	singleSource.clip = wareOffSound;
	singleSource.Play();
	renderer.material.color.a = 1f;
	GetComponent(SpriteRenderer).sprite = normalSprite;
}

function ResetSprite(){
	if (ghostIsActive)
	{GetComponent(SpriteRenderer).sprite = ghostJumpingSprite;
	 yield WaitForSeconds(0.1);
	 if (!nitroIsActive){
	 	GetComponent(SpriteRenderer).sprite = ghostSprite;
	 	}
	 }
	else if (!ouch)
	 {	GetComponent(SpriteRenderer).sprite = jumpingSprite;
	  	yield WaitForSeconds(0.1);
	  	if (!nitroIsActive)
	  	{
	 		 GetComponent(SpriteRenderer).sprite = normalSprite;
	 	}
	}
}


function OnTriggerEnter2D(collInfo : Collider2D){
	Debug.Log("I collided with something tagged as: " +collInfo.tag);
	if (!ghostIsActive && !nitroIsActive){
		collInfo.transform.parent = null;
		switch(collInfo.tag){
			case "ObstacleUp":
				if (life >= 1){
					collInfo.rigidbody2D.velocity = new Vector2(0.5, 4);
					life--;
					singleSource.clip = ouchSound;
					singleSource.Play();
					ouch = true;
	 				yield WaitForSeconds(0.5);
					ouch = false;
					} 				
				break;
			case "ObstacleDown":
				if (life >= 1){
					collInfo.rigidbody2D.velocity = new Vector2(0.5, -4);
					life--;
					singleSource.clip = ouchSound;
					singleSource.Play();
					ouch = true;
	 				yield WaitForSeconds(0.5);
					ouch = false;
					} 
					break;
			case "ExtraLife":
				singleSource.clip = powerSound;
				singleSource.Play();
				life++;
				Destroy(collInfo.gameObject);
				break;
			case "Ghost":
				singleSource.clip = powerSound;
				singleSource.Play();
				ghost++;
				Destroy(collInfo.gameObject);
				break;
			case "Nitro":
				singleSource.clip = powerSound;
				singleSource.Play();
				nitro++;
				Destroy(collInfo.gameObject);
				break;
			default:
				Debug.Log("No collider tag match found");
				break;
		}
	}else{
		switch(collInfo.tag){
		case "ObstacleUp":
			if (nitroIsActive){
				Destroy(collInfo.gameObject);
				GameManager.score++;
				} 				
			break;
		case "ObstacleDown":
			if (nitroIsActive){
				Destroy(collInfo.gameObject);
				GameManager.score++;
				} 
			break;
		case "ExtraLife":
			singleSource.clip = powerSound;
			singleSource.Play();
			life++;
			Destroy(collInfo.gameObject);
			break;
		case "Ghost":
			singleSource.clip = powerSound;
			singleSource.Play();
			ghost++;
			Destroy(collInfo.gameObject);
			break;
		case "Nitro":
			singleSource.clip = powerSound;
			singleSource.Play();
			nitro++;
			Destroy(collInfo.gameObject);
			break;
		default:
			Debug.Log("No collider tag match found");
			break;
		
		}
	}
}