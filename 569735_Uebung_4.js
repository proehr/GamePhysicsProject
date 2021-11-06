/**
 * @file GTAT2 Game Physics Übung 4
 * @copyright Pauline Röhr 03.11.2020, Matrikelnummer: 569735
 */

/**
 * ------------------------------- DEKLARATION -------------------------------
 * Längenangaben einheitlich, hier in m
 */
var distanceTriangles = 1.2;
var radiusMiddleBall = 0.016;
var lengthSeesaw = 0.25;
var widthTriangles = 0.035;
var heightTriangles = 0.03;
var scaleDistanceTriangleToWindowX = 2.0 / 3.0;
var radiusTouchSensitivity = 0.03;
var seesawMidToTinyTriangleMid = 0.09;
var seesawMidToPlayerBallMid = 0.11;
var tinyTriangleHeight = 0.0125;
var tinytriangleWidth = 0.015;
var playerBallRadius = 0.01;

// max Geschwindigkeit in m/s
var maxVel = 5;

// Gravitationskonstante
var g = 9.81;

// wiederverwendete Variablen
var scaleM;
var rotationLeft;
var rotationRight;
var rotationMax;
var leftActive;
var angleLeft;
var velocityLeft;
var playerBallLeftx0;
var playerBallLefty0;
var playerBallLeftx;
var playerBallLefty;
var rightActive;
var angleLeft;
var velocityLeft;
var playerBallRightx0;
var playerBallRighty0;
var playerBallRightx;
var playerBallRighty;
var t;

// wiederverwendete Canvas-Variablen
var button;

// GameState Variablen - bis jetzt noch fast unbenutzt für Test-Zwecke
var gameStateNew = "new"
var gameStateActive = "active"
var gameStatePaused = "paused"
var gameState = gameStateNew;

/**
 * --------------------------------- SETUP -----------------------------------
 */

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    calculateScale()
    rotationLeft = -atan(heightTriangles * 2 / lengthSeesaw);
    rotationRight = atan(heightTriangles * 2 / lengthSeesaw);
    rotationMax = rotationRight;
    playerBallLeftx0 = cos(-rotationMax) * (-seesawMidToPlayerBallMid) - sin(-rotationMax) * playerBallRadius;
    playerBallLefty0 = sin(-rotationMax) * (-seesawMidToPlayerBallMid) + cos(-rotationMax) * playerBallRadius;
    playerBallRightx0 = cos(rotationMax) * seesawMidToPlayerBallMid - sin(rotationMax) * playerBallRadius;
    playerBallRighty0 = sin(rotationMax) * seesawMidToPlayerBallMid + cos(rotationMax) * playerBallRadius;
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

    // Wippenelemente links
    push();
    translate(-scaleM * distanceTriangles / 2, scaleM * heightTriangles);
    if (!rightActive && mouseIsPressed && mouseIsInLeftCircle(-scaleM * lengthSeesaw / 2, 0, scaleM * radiusTouchSensitivity)) {
        rotationLeft = -getAngleFromMousePosition();
        angleLeft = rotationMax + rotationLeft;
    } else if (!mouseIsPressed && rotationLeft > -rotationMax) {
        velocityLeft = maxVel * angleLeft / (rotationMax * 2);
        rotationLeft = min(rotationMax, max(-rotationMax, rotationLeft - 2 * velocityLeft / (frameRate() * lengthSeesaw)));
        if (rotationLeft <= -rotationMax) {
            leftActive = true;
            t = 0;
        }
    } else if (leftActive) {
        fill('#FF9999');
        stroke('#FF9999');
        // Spielerball links in Bewegung
        circle(scaleM * playerBallLeftx, scaleM * playerBallLefty, scaleM * playerBallRadius * 2);
        t += 1 / frameRate();
        playerBallLeftx = playerBallLeftx0 + velocityLeft * cos(HALF_PI - rotationMax) * t;
        playerBallLefty = playerBallLefty0 + t * (velocityLeft * sin(HALF_PI - rotationMax)) - 0.5 * g * sq(t);
        if (playerBallLefty <= -heightTriangles + playerBallRadius) {
            playerBallLefty = -heightTriangles + playerBallRadius;
        }
        if (playerBallLeftx >= 5*distanceTriangles/4.0) {
            leftActive = false
        }
    }
    rotate(rotationLeft)
    
    // Falls schräger Wurf/Rollen links nicht aktiv, zeichne Spielerball links als Teil der Wippe
    if (!leftActive) {
        fill('#FF9999');
        stroke('#FF9999');
        circle(scaleM * (-seesawMidToPlayerBallMid), scaleM * playerBallRadius, scaleM * playerBallRadius * 2);
    }

    fill('#77AAFF');
    stroke('#77AAFF');
    strokeWeight(2);
    // Wippe mit Halter-Dreieck links
    line(-scaleM * lengthSeesaw / 2, 0, scaleM * lengthSeesaw / 2, 0);
    triangle(scaleM * (-seesawMidToTinyTriangleMid - tinytriangleWidth / 2), 0, scaleM * (-seesawMidToTinyTriangleMid + tinytriangleWidth / 2), 0, scaleM * (-seesawMidToTinyTriangleMid), scaleM * tinyTriangleHeight);

    pop();

    //Wippe rechts
    push();
    translate(scaleM * distanceTriangles / 2, scaleM * heightTriangles)
    if (!leftActive && mouseIsPressed && mouseIsInRightCircle(scaleM * lengthSeesaw / 2, 0, scaleM * radiusTouchSensitivity)) {
        rotationRight = getAngleFromMousePosition();
        angleRight = rotationMax - rotationRight;
    } else if (!mouseIsPressed && rotationRight < rotationMax) {
        velocityRight = maxVel * angleRight / (rotationMax * 2);
        rotationRight = min(rotationMax, max(-rotationMax, rotationRight + 2 * velocityRight / (frameRate() * lengthSeesaw)));
        if (rotationRight >= rotationMax) {
            rightActive = true;
            t = 0;
        }
    } else if (rightActive) {
        fill('#FF9999');
        stroke('#FF9999');
        //Spielerball rechts in Bewegung
        circle(scaleM * playerBallRightx, scaleM * playerBallRighty, scaleM * playerBallRadius * 2);
        t += 1 / frameRate();
        playerBallRightx = playerBallRightx0 - velocityRight * cos(HALF_PI - rotationMax) * t;
        playerBallRighty = playerBallRighty0 + t * (velocityRight * sin(HALF_PI - rotationMax)) - 0.5 * g * sq(t);
        if (playerBallRighty <= -heightTriangles + playerBallRadius) {
            playerBallRighty = -heightTriangles + playerBallRadius;
        }
        if (playerBallRightx <= -5*distanceTriangles/4.0) {
            rightActive = false
        }
    }
    rotate(rotationRight);

    // Falls schräger Wurf/Rollen rechts nicht aktiv, zeichne Spielerball rechts als Teil der Wippe
    if (!rightActive) {
        fill('#FF9999');
        stroke('#FF9999');
        circle(scaleM * (seesawMidToPlayerBallMid), scaleM * playerBallRadius, scaleM * playerBallRadius * 2);
    }
    fill('#77AAFF');
    stroke('#77AAFF');
    strokeWeight(2);
    // Wippe mit Halter-Dreieck rechts
    line(-scaleM * lengthSeesaw / 2, 0, scaleM * lengthSeesaw / 2, 0);
    triangle(scaleM * (seesawMidToTinyTriangleMid - tinytriangleWidth / 2), 0, scaleM * (seesawMidToTinyTriangleMid + tinytriangleWidth / 2), 0, scaleM * seesawMidToTinyTriangleMid, scaleM * tinyTriangleHeight);
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
    translMouseY = -mouseY + 6 * windowHeight / 7 - scaleM * heightTriangles;
    rotMouseX = cos(rotationLeft) * translMouseX + sin(rotationLeft) * translMouseY;
    rotMouseY = sin(rotationLeft) * translMouseX - cos(rotationLeft) * translMouseY;
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
    translMouseY = -mouseY + 6 * windowHeight / 7 - scaleM * heightTriangles;
    rotMouseX = cos(rotationRight) * translMouseX + sin(rotationRight) * translMouseY;
    rotMouseY = sin(rotationRight) * translMouseX - cos(rotationRight) * translMouseY;
    diffX = rotMouseX - x;
    diffY = rotMouseY - y;
    if (sq(diffX) + sq(diffY) <= sq(r)) {
        return true;
    }
    return false;
}

// Berechnet den Canvas-Drehwinkel anhand der Mouszeiger-Y-Position
// Der Drehwinkel geht momentan noch über den Boden hinaus,  dies lässt sich noch begrenzen
function getAngleFromMousePosition() {
    translMouseY = -mouseY + 6 * windowHeight / 7 - scaleM * heightTriangles;
    return min(rotationMax, max(-rotationMax, asin(translMouseY / (lengthSeesaw * scaleM / 2))));
}


