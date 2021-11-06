/**
 * @file GTAT2 Game Physics Übung 3
 * @copyright Pauline Röhr 21.10.2020, Matrikelnummer: 569735
 */

/**
 * ------------------------------- DEKLARATION -------------------------------
 * Längenangaben einheitlich, hier in cm
 */
var distanceTriangles = 120.0;
var radiusMiddleBall = 1.6;
var lengthSeesaw = 25.0;
var widthTriangles = 3.0;
var heightTriangles = 2.5;
var scaleDistanceTriangleToWindowX = 2.0 / 3.0;
var radiusTouchSensitivity = 2;
var seesawMidToTinyTriangleMid = 9.0;
var seesawMidToPlayerBallMid = 11;
var tinyTriangleHeight = 1.25;
var tinytriangleWidth = 1.5;
var playerBallRadius = 1.0;

// wiederverwendete Variablen
var scaleM;
var rotationLeft;
var rotationLeft;

// wiederverwendete Canvas-Variablen
var button;

// GameState Variablen
var gameStateNew = "new"
var gameStateActive = "active"
var gameStatePaused = "paused"
var gameState = gameStateNew;

/**
 * --------------------------------- SETUP -----------------------------------
 */

function setup() {
    createCanvas(windowWidth, windowHeight);
    calculateScale()
    rotationLeft = -atan(heightTriangles * 2 / lengthSeesaw);
    rotationRight = atan(heightTriangles * 2 / lengthSeesaw);
}

//Passt Canvas an das geänderte Fenster an
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calculateScale();
}

// Berechnet den Maßstab M und speichert diesen in die entsprechende Variable
function calculateScale() {
    scaleM = scaleDistanceTriangleToWindowX * windowWidth / distanceTriangles;
}

/**
 * --------------------------------- DRAW -----------------------------------
 */

function draw() {

    // ---------------------------- ADMIN ------------------------- //

    // initialize button on new games
    if (gameState == gameStateNew) {
        console.log("gamestate is " + gameState);
        gameState = gameStatePaused;
        button = createButton("START");
        button.position(windowWidth / 10, 9 * windowHeight / 10);
        button.mousePressed(changeGameState);
        console.log("gamestate is " + gameState);
    }

    // ------------------- BERECHNUNG & DARSTELLUNG --------------- //

    // Canvas leeren um aufeinanderliegende Zeichnungen zu vermeiden
    clear()

    push();
    // Lässt y nach oben positiv steigen
    scale(1, -1);
    // Setzt Mittelpunkt für das Koordinatensystem auf Mitte des Bodens
    translate(windowWidth / 2, -6 * windowHeight / 7);

    // Boden
    line(-windowWidth / 2, 0, windowWidth / 2, 0);

    // Kugel in der Mitte
    fill('#FFAA77');
    circle(0, scaleM * radiusMiddleBall, scaleM * 2 * radiusMiddleBall);

    // Dreieck für Wippe links und rechts
    stroke('#000099');
    fill('#77AAFF');
    triangle(-scaleM * (distanceTriangles + widthTriangles) / 2, 0, -scaleM * (distanceTriangles - widthTriangles) / 2, 0, -scaleM * distanceTriangles / 2, scaleM * heightTriangles);
    triangle(scaleM * (distanceTriangles + widthTriangles) / 2, 0, scaleM * (distanceTriangles - widthTriangles) / 2, 0, scaleM * distanceTriangles / 2, scaleM * heightTriangles);

    // Wippe links
    push();
    translate(-scaleM * distanceTriangles / 2, scaleM * heightTriangles);
    if (mouseIsPressed && mouseIsInLeftCircle(-scaleM * lengthSeesaw / 2, 0, scaleM * radiusTouchSensitivity)) {
        rotationLeft = - getAngleFromMousePosition();
    }
    rotate(rotationLeft)
    fill('#FF9999');
    stroke('#FF9999');
    circle(scaleM*(-seesawMidToPlayerBallMid), scaleM*playerBallRadius, scaleM*playerBallRadius*2);
    fill('#77AAFF');
    stroke('#77AAFF');
    strokeWeight(2);
    line(-scaleM * lengthSeesaw / 2, 0, scaleM * lengthSeesaw / 2, 0);
    triangle(scaleM*(-seesawMidToTinyTriangleMid-tinytriangleWidth/2),0, scaleM*(-seesawMidToTinyTriangleMid+tinytriangleWidth/2),0, scaleM*(-seesawMidToTinyTriangleMid),scaleM*tinyTriangleHeight);

    pop();
    
    //Wippe rechts
    push();
    translate(scaleM * distanceTriangles / 2, scaleM * heightTriangles)
    if (mouseIsPressed && mouseIsInRightCircle(scaleM * lengthSeesaw / 2, 0, scaleM * radiusTouchSensitivity)) {
        rotationRight = getAngleFromMousePosition();
    }
    rotate(rotationRight);
    fill('#FF9999');
    stroke('#FF9999');
    circle(scaleM*(seesawMidToPlayerBallMid), scaleM*playerBallRadius, scaleM*playerBallRadius*2);
    fill('#77AAFF');
    stroke('#77AAFF');
    strokeWeight(2);
    line(-scaleM * lengthSeesaw / 2, 0, scaleM * lengthSeesaw / 2, 0);
    triangle(scaleM*(seesawMidToTinyTriangleMid-tinytriangleWidth/2),0, scaleM*(seesawMidToTinyTriangleMid+tinytriangleWidth/2),0, scaleM*seesawMidToTinyTriangleMid,scaleM*tinyTriangleHeight);
    pop();
    pop()

}

// wird durch button click ausgeführt
// ändert GameState und button-text
// GameState hat noch keine Auswirkung auf Spielverhalten
function changeGameState() {
    console.log("gamestate is " + gameState);
    if (gameState == gameStatePaused) {
        button.html('RESET');
        gameState = gameStateActive;
    } else {
        button.html('START');
        gameState = gameStatePaused
    }
    console.log("gamestate is " + gameState);
}

// untersucht ob Mauszeiger im linken Kreis um das linke Wippenende ist
function mouseIsInLeftCircle(x, y, r) {
    translMouseX = mouseX - windowWidth / 2 + scaleM * distanceTriangles / 2;
    translMouseY = - mouseY + 6 * windowHeight / 7 - scaleM * heightTriangles;
    rotMouseX = cos(rotationLeft)*translMouseX + sin(rotationLeft)*translMouseY;
    rotMouseY = sin(rotationLeft)*translMouseX - cos(rotationLeft)*translMouseY;
    diffX = rotMouseX - x;
    diffY = rotMouseY - y;
    if (sq(diffX) + sq(diffY) <= sq(r)) {
        return true;
    }
    return false;
}

// untersucht ob Mauszeiger im rechten Kreis um das recht Wippenende ist
function mouseIsInRightCircle(x, y, r) {
    translMouseX = mouseX - windowWidth / 2 - scaleM * distanceTriangles / 2;
    translMouseY = - mouseY + 6 * windowHeight / 7 - scaleM * heightTriangles;
    rotMouseX = cos(rotationRight)*translMouseX + sin(rotationRight)*translMouseY;
    rotMouseY = sin(rotationRight)*translMouseX - cos(rotationRight)*translMouseY;
    diffX = rotMouseX - x;
    diffY = rotMouseY - y;
    if (sq(diffX) + sq(diffY) <= sq(r)) {
        return true;
    }
    return false;
}

// Berechnet den Canvas-Drehwinkel anhand der Mouszeiger-Y-Position
// Der Drehwinkel geht momentan noch über den Boden hinaus,  dies lässt sich noch begrenzen
function getAngleFromMousePosition(){
    translMouseY = - mouseY + 6 * windowHeight / 7 - scaleM * heightTriangles;
    return asin(translMouseY/(lengthSeesaw*scaleM/2));
}


