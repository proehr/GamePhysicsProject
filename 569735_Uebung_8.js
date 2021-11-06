/**
 * @file GTAT2 Game Physics Übung 8
 * @copyright Pauline Röhr 02.01.2021, Matrikelnummer: 569735
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
var cw = 0.45;
var ballWeight = 2.5;

// max Geschwindigkeit in m/s
var maxVel = 5;

// Gravitationskonstante
var g = 9.81;

// Framerate
var fr = 60;

// Rollreibungskoeffizient
var myRR = 0.03;

// Luftdichte
var pAir = 1.2041;

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
var leftUp;
var rightUp;
var rightActive;
var angleRight;
var velocity0Left;
var velocity0Right;
var velocityXLeft;
var velocityYLeft;
var startVelocityRollLeft;
var velocityXRight;
var velocityYRight;
var startVelocityRollRight;
var playerBallRightx0;
var playerBallRighty0;
var playerBallRightx;
var playerBallRighty;
var t;
var a;
var aRREvenGround;
var aRRSlope;
var pointUp1;
var pointUp2;
var dt;
var crossSectionArea;

// wiederverwendete Canvas-Variablen
var button;

// GameState Variablen
var gameStateNew = "new";
var gameStateActive = "active";
var gameStatePaused = "paused";
var gameState = gameStateNew;

// PlayState Variablen
var playStateTouching = "touching";
var playStateReleased = "released";
var playStateFlying = "flying";
var playStateRolling = "rolling";
var playStateRollingUp = "rollingUp";
var playStateInactive = "inactive";
var playStateLeft = playStateInactive;
var playStateRight = playStateInactive;

/**
 * --------------------------------- SETUP -----------------------------------
 */

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(fr);
    calculateScale()
    setDefaultValues()
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

function setDefaultValues() {
    rotationLeft = -atan(heightTriangles * 2 / lengthSeesaw);
    rotationRight = atan(heightTriangles * 2 / lengthSeesaw);
    rotationMax = rotationRight;
    playerBallLeftx0 = cos(-rotationMax) * (-seesawMidToPlayerBallMid) - sin(-rotationMax) * playerBallRadius;
    playerBallLefty0 = sin(-rotationMax) * (-seesawMidToPlayerBallMid) + cos(-rotationMax) * playerBallRadius;
    playerBallRightx0 = playerBallLeftx0;
    playerBallRighty0 = playerBallLefty0;
    a = g * sin(rotationMax);
    aRREvenGround = -g * myRR;
    aRRSlope = -g * cos(rotationMax) * myRR;
    t = 0;
    pointUp1 = distanceTriangles - sqrt(sq(lengthSeesaw / 2) - sq(heightTriangles)) - playerBallRadius;
    pointUp2 = sqrt(sq(lengthSeesaw / 2) - sq(heightTriangles)) + playerBallRadius
    dt = 1.0 / fr;
    leftUp = 0;
    rightUp = 0;
    crossSectionArea = PI * playerBallRadius * playerBallRadius;
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

    // Wippenelemente links und rechts
    if (gameState === gameStateActive) {
        // kalkuliert x und y Koordinaten von player ball links in Abhängigkeit von PlayStateLeft
        switch (playStateLeft) {
            case playStateInactive:
                rotationLeft = -rotationMax;
                playerBallLeftx = cos(rotationLeft) * (-seesawMidToPlayerBallMid) - sin(rotationLeft) * playerBallRadius;
                playerBallLefty = sin(rotationLeft) * (-seesawMidToPlayerBallMid) + cos(rotationLeft) * playerBallRadius;
                break;
            case playStateTouching:
                rotationLeft = -getAngleFromMousePosition();
                angleLeft = rotationMax + rotationLeft;
                playerBallLeftx = cos(rotationLeft) * (-seesawMidToPlayerBallMid) - sin(rotationLeft) * playerBallRadius;
                playerBallLefty = sin(rotationLeft) * (-seesawMidToPlayerBallMid) + cos(rotationLeft) * playerBallRadius;
                break;
            case playStateReleased:
                velocity0Left = maxVel * angleLeft / (rotationMax * 2);
                rotationLeft = min(rotationMax, max(-rotationMax, rotationLeft - 2 * velocity0Left / (frameRate() * lengthSeesaw)));
                playerBallLeftx = cos(rotationLeft) * (-seesawMidToPlayerBallMid) - sin(rotationLeft) * playerBallRadius;
                playerBallLefty = sin(rotationLeft) * (-seesawMidToPlayerBallMid) + cos(rotationLeft) * playerBallRadius;
                break;
            case playStateFlying:
                velocityXLeft -= crossSectionArea * cw * pAir * dt;
                playerBallLeftx += velocityXLeft * dt;
                velocityYLeft -= (g + crossSectionArea * cw * pAir) * dt;
                playerBallLefty += velocityYLeft * dt;
                break;
            case playStateRolling:
                if (startVelocityRollLeft >= 0) {
                    velocityXLeft = max(0, velocityXLeft + (aRREvenGround * dt));
                    console.log("this should appear")
                } else {
                    velocityXLeft = min(0, velocityXLeft + (aRREvenGround * dt));
                }
                playerBallLeftx += velocityXLeft * dt;
                break;
            case playStateRollingUp:
                velocityXLeft += (a + aRRSlope) * dt;
                leftUp += velocityXLeft * dt;
                playerBallLeftx = playerBallLeftx0 + leftUp * cos(rotationMax);
                playerBallLefty = playerBallLefty0 + abs(leftUp * sin(rotationMax));
                break;
        }
        // kalkuliert x und y Koordinaten von player ball rechts in Abhängigkeit von PlayStateRight
        switch (playStateRight) {
            case playStateInactive:
                rotationRight = -rotationMax;
                playerBallRightx = cos(rotationRight) * (-seesawMidToPlayerBallMid) - sin(rotationRight) * playerBallRadius;
                playerBallRighty = sin(rotationRight) * (-seesawMidToPlayerBallMid) + cos(rotationRight) * playerBallRadius;
                break;
            case playStateTouching:
                rotationRight = -getAngleFromMousePosition();
                angleRight = rotationMax + rotationRight;
                playerBallRightx = cos(rotationRight) * (-seesawMidToPlayerBallMid) - sin(rotationRight) * playerBallRadius;
                playerBallRighty = sin(rotationRight) * (-seesawMidToPlayerBallMid) + cos(rotationRight) * playerBallRadius;
                break;
            case playStateReleased:
                velocity0Right = maxVel * angleRight / (rotationMax * 2);
                rotationRight = min(rotationMax, max(-rotationMax, rotationRight - 2 * velocity0Right / (frameRate() * lengthSeesaw)));
                playerBallRightx = cos(rotationRight) * (-seesawMidToPlayerBallMid) - sin(rotationRight) * playerBallRadius;
                playerBallRighty = sin(rotationRight) * (-seesawMidToPlayerBallMid) + cos(rotationRight) * playerBallRadius;
                break;
            case playStateFlying:
                velocityXRight -= crossSectionArea * cw * pAir * dt;
                playerBallRightx += velocityXRight * dt;
                velocityYRight -= (g + crossSectionArea * cw * pAir) * dt;
                playerBallRighty += velocityYRight * dt;
                break;
            case playStateRolling:
                if (startVelocityRollRight >= 0) {
                    velocityXRight = max(0, velocityXRight + (aRREvenGround * dt));
                    console.log("this should appear")
                } else {
                    velocityXRight = min(0, velocityXRight + (aRREvenGround * dt));
                }
                playerBallRightx += velocityXRight * dt;
                break;
            case playStateRollingUp:
                velocityXRight += (a + aRRSlope) * dt;
                rightUp += velocityXRight * dt;
                playerBallRightx = playerBallRightx0 + rightUp * cos(rotationMax);
                playerBallRighty = playerBallRighty0 + abs(rightUp * sin(rotationMax));
                break;
        }
        getPlayStateLeft();
        getPlayStateRight();
    } else {

        //falls Spiel nicht aktiv: nutze standardwerte
        rotationLeft = -rotationMax;
        rotationRight = -rotationMax;
        playerBallLeftx = cos(rotationLeft) * (-seesawMidToPlayerBallMid) - sin(rotationLeft) * playerBallRadius;
        playerBallLefty = sin(rotationLeft) * (-seesawMidToPlayerBallMid) + cos(rotationLeft) * playerBallRadius;
        playerBallRightx = cos(rotationRight) * (-seesawMidToPlayerBallMid) - sin(rotationRight) * playerBallRadius;
        playerBallRighty = sin(rotationRight) * (-seesawMidToPlayerBallMid) + cos(rotationRight) * playerBallRadius;
    }
    push();

    // Zeichne linke Wippenelemente
    translate(-scaleM * distanceTriangles / 2, scaleM * heightTriangles);

    fill('#FF9999');
    stroke('#FF9999');
    // PlayerBall links
    circle(scaleM * playerBallLeftx, scaleM * playerBallLefty, scaleM * playerBallRadius * 2);

    rotate(rotationLeft)
    fill('#77AAFF');
    stroke('#77AAFF');
    strokeWeight(2);
    // Wippe mit Halter-Dreieck links
    line(-scaleM * lengthSeesaw / 2, 0, scaleM * lengthSeesaw / 2, 0);
    triangle(scaleM * (-seesawMidToTinyTriangleMid - tinytriangleWidth / 2), 0, scaleM * (-seesawMidToTinyTriangleMid + tinytriangleWidth / 2), 0, scaleM * (-seesawMidToTinyTriangleMid), scaleM * tinyTriangleHeight);
    pop();

    push();
    // Zeichne rechte Wippenelemente
    scale(-1, 1);
    translate(-scaleM * distanceTriangles / 2, scaleM * heightTriangles);

    fill('#FF9999');
    stroke('#FF9999');
    // PlayerBall rechts
    circle(scaleM * playerBallRightx, scaleM * playerBallRighty, scaleM * playerBallRadius * 2);

    rotate(rotationRight)
    fill('#77AAFF');
    stroke('#77AAFF');
    strokeWeight(2);
    // Wippe mit Halter-Dreieck rechts
    line(-scaleM * lengthSeesaw / 2, 0, scaleM * lengthSeesaw / 2, 0);
    triangle(scaleM * (-seesawMidToTinyTriangleMid - tinytriangleWidth / 2), 0, scaleM * (-seesawMidToTinyTriangleMid + tinytriangleWidth / 2), 0, scaleM * (-seesawMidToTinyTriangleMid), scaleM * tinyTriangleHeight);
    pop()

    pop()

}

// wird durch button click ausgeführt
// ändert GameState, PlayState und button-text
function changeGameState() {
    console.log("gamestate is " + gameState);
    if (gameState == gameStatePaused) {
        button.html('RESET');
        gameState = gameStateActive;
    } else {
        button.html('START');
        gameState = gameStatePaused
        playStateLeft = playStateInactive;
        playStateRight = playStateInactive;
        setDefaultValues();
    }
    console.log("gamestate is " + gameState);
}


// untersucht Bewegung des linken PlayerBalls und geht wenn nötig in den nächsten PlayState über
function getPlayStateLeft() {
    if (mouseIsPressed && playStateLeft === playStateInactive && mouseIsInLeftCircle(-scaleM * lengthSeesaw / 2, 0, scaleM * radiusTouchSensitivity)) {
        playStateLeft = playStateTouching;
        console.log(playStateLeft);
    } else if (playStateLeft === playStateTouching && !mouseIsPressed) {
        playStateLeft = playStateReleased;
        console.log(playStateLeft);
    } else if (playStateLeft === playStateReleased && rotationLeft <= -rotationMax) {
        rotationLeft = -rotationMax;
        velocityXLeft = velocity0Left * cos(HALF_PI - rotationMax);
        velocityYLeft = velocity0Left * sin(HALF_PI - rotationMax);
        playStateLeft = playStateFlying;
        console.log(playStateLeft);
    } else if (playStateLeft === playStateFlying && playerBallLefty <= -heightTriangles + playerBallRadius) {
        playerBallLefty = -heightTriangles + playerBallRadius;
        startVelocityRollLeft = velocityXLeft;
        playStateLeft = playStateRolling;
        console.log(playStateLeft);
    } else if (playStateLeft === playStateRolling && (playerBallLeftx >= pointUp1 || playerBallLeftx <= pointUp2)) {
        a = -a;
        if (playerBallLeftx >= pointUp1) {
            playerBallLeftx0 = pointUp1
        } else if (playerBallLeftx <= pointUp2) {
            playerBallLeftx0 = pointUp2
        }
        playerBallLefty0 = -heightTriangles + playerBallRadius;
        playStateLeft = playStateRollingUp;
        console.log(playStateLeft);
    } else if (playStateLeft === playStateRollingUp && playerBallLeftx <= pointUp1 && playerBallLeftx >= pointUp2) {
        aRREvenGround = -aRREvenGround;
        startVelocityRollLeft = velocityXLeft;
        if (playerBallLeftx >= pointUp1) {
            playerBallLeftx0 = pointUp1
        } else if (playerBallLeftx <= pointUp2) {
            playerBallLeftx0 = pointUp2
        }
        playerBallLefty = -heightTriangles + playerBallRadius;
        playStateLeft = playStateRolling;
        console.log(playStateLeft);
    }
}

// untersucht Bewegung des rechten PlayerBalls und geht wenn nötig in den nächsten PlayState über
function getPlayStateRight() {
    if (mouseIsPressed && playStateRight === playStateInactive && mouseIsInRightCircle(scaleM * lengthSeesaw / 2, 0, scaleM * radiusTouchSensitivity)) {
        playStateRight = playStateTouching;
        console.log(playStateRight);
    } else if (playStateRight === playStateTouching && !mouseIsPressed) {
        playStateRight = playStateReleased;
        console.log(playStateRight);
    } else if (playStateRight === playStateReleased && rotationRight <= -rotationMax) {
        rotationRight = -rotationMax;
        velocityXRight = velocity0Right * cos(HALF_PI - rotationMax);
        velocityYRight = velocity0Right * sin(HALF_PI - rotationMax);
        playStateRight = playStateFlying;
        console.log(playStateRight);
    } else if (playStateRight === playStateFlying && playerBallRighty <= -heightTriangles + playerBallRadius) {
        playerBallRighty = -heightTriangles + playerBallRadius;
        startVelocityRollRight = velocityXRight;
        playStateRight = playStateRolling;
        console.log(playStateRight);
    } else if (playStateRight === playStateRolling && (playerBallRightx >= pointUp1 || playerBallRightx <= pointUp2)) {
        a = -a;
        if (playerBallRightx >= pointUp1) {
            playerBallRightx0 = pointUp1
        } else if (playerBallRightx <= pointUp2) {
            playerBallRightx0 = pointUp2
        }
        playerBallRighty0 = -heightTriangles + playerBallRadius;
        playStateRight = playStateRollingUp;
        console.log(playStateRight);
    } else if (playStateRight === playStateRollingUp && playerBallRightx <= pointUp1 && playerBallRightx >= pointUp2) {
        aRREvenGround = -aRREvenGround;
        startVelocityRollRight = velocityXRight;
        if (playerBallRightx >= pointUp1) {
            playerBallRightx0 = pointUp1
        } else if (playerBallRightx <= pointUp2) {
            playerBallRightx0 = pointUp2
        }
        playerBallRighty = -heightTriangles + playerBallRadius;
        playStateRight = playStateRolling;
        console.log(playStateRight);
    }
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


