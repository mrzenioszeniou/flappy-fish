#pragma strict


private var minY : float;
private var maxY : float;

function Start () 
{
	minY = Camera.main.ScreenToWorldPoint(new Vector3(0f,0.1 * Screen.height,5f)).y;
	maxY = Camera.main.ScreenToWorldPoint(new Vector3(0f,0.9 * Screen.height,5f)).y;
	transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(Screen.width * 1.1f,0f,5f)).x;
	transform.position.y = Random.Range(minY,maxY);
}

function OnBecameInvisible()
{ 
	Destroy(gameObject) ; 
} 