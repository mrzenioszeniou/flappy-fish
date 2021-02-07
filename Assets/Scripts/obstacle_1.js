private var counted : boolean = false;
private var playerObj : GameObject; 
private var xPlayer;

function Start()
{
	playerObj = GameObject.FindWithTag("Player");
	xPlayer = playerObj.transform.position.x;
	transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Screen.width * 1.1f,0f,5f));
}

function Update()
{
	if ((renderer.bounds.max.x < xPlayer) && (!counted))
	{
		GameManager.score++;
		counted = true;
	}  	
}

function OnBecameInvisible()
{ 
	Destroy(gameObject) ; 
}