/**
* @file GTAT2 Game Physics Übung 1
* @copyright Pauline Röhr 08.10.2020, Matrikelnummer: 569735
*/

var xLeftTriangle;
var xRightTriangle;
var xSeesaw;
var xBallRadius;
var yHeightGround;

function setup() {
  createCanvas(windowWidth,windowHeight); 
  drawSetup();
}

/**
 * resizes Canvas and game setup on window size changes
 */
function windowResized() {
	resizeCanvas(windowWidth, windowHeight); 
	drawSetup();
}


function drawSetup(){
	xLeftTriangle = windowWidth/6;
	xRightTriangle = (5*windowWidth)/6;
	xSeesaw = (5*windowWidth)/36;
	xBallRadius = (2*windowWidth)/225;
	yHeightGround = (6*windowHeight)/7;

	line(0,yHeightGround,windowWidth,yHeightGround);

	fill('#FFAA77');
	circle(windowWidth/2,yHeightGround-xBallRadius,2*xBallRadius);
	
	stroke('#000099');
	fill('#77AAFF');
	triangle(xLeftTriangle,yHeightGround-2*xBallRadius,xLeftTriangle-xBallRadius,yHeightGround,xLeftTriangle+xBallRadius,yHeightGround);
	triangle(xRightTriangle,yHeightGround-2*xBallRadius,xRightTriangle-xBallRadius,yHeightGround,xRightTriangle+xBallRadius,yHeightGround);

	stroke('#77AAFF');
	strokeWeight(3);

	line(-calcX(yHeightGround-4*xBallRadius) + xLeftTriangle,yHeightGround-4*xBallRadius, calcX(yHeightGround) + xLeftTriangle,yHeightGround);
	line(-calcX(yHeightGround) + xRightTriangle,yHeightGround, calcX(yHeightGround - 4* xBallRadius) + xRightTriangle,yHeightGround-4*xBallRadius);
	strokeWeight(1);
	stroke('#000000');
}

function calcX(yValue){
	x = Math.sqrt(Math.pow(xSeesaw/2,2) - Math.pow(yValue-yHeightGround,2));
	return x;
}

