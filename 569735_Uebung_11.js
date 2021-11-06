/**
 * @file GTAT2 Game Physics Übung 11
 * @copyright Pauline Röhr 16.01.2021, Matrikelnummer: 569735
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

// Ballgewichte
var playerBallWeight = 1;
var mainBallWeight = 1.3;

// Strömungswiderstandskoeffizient
var cw = 0.45;

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
var testBallX;
var testBallY;
var velocityXTest;
var velocityYTest;
var testAngle;
var velocityTestTang;
var velocityTestCent;
var mainBallX;
var mainBallY;
var velocityXMain;
var velocityYMain;
var velocityMainTang;
var velocityMainCent;
var t;
var a;
var aRREvenGround;
var aRRSlope;
var pointUp1;
var pointUp2;
var dt;
var crossSectionArea;
var tau;

// wiederverwendete Canvas-Variablen
var button;
var testButton;
var positionSliderX;
var positionSliderY;
var velocitySlider;
var angleSlider;

// GameState Variablen
var gameStateNew = "new";
var gameStateActive = "active";
var gameStatePaused = "paused";
var gameStateTest = "test";
var gameStateTestActive = "testActive";
var gameState = gameStateNew;

// PlayState Variablen
var playStateTouching = "touching";
var playStateReleased = "released";
var playStateFlying = "flying";
var playStateRolling = "rolling";
var playStateRollingUp = "rollingUp";
var playStateInactive = "inactive";
var playStateAfterCollision = "afterCollision"
var playStateLeft = playStateInactive;
var playStateRight = playStateInactive;
var playStateTest = playStateFlying;

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

// Setzt alle Werte zurück auf ihre Standardwerte
function setDefaultValues() {
    rotationLeft = -atan(heightTriangles * 2 / lengthSeesaw);
    rotationRight = atan(heightTriangles * 2 / lengthSeesaw);
    rotationMax = rotationRight;
    playerBallLeftx0 = cos(-rotationMax) * (-seesawMidToPlayerBallMid) - sin(-rotationMax) * playerBallRadius;
    playerBallLefty0 = sin(-rotationMax) * (-seesawMidToPlayerBallMid) + cos(-rotationMax) * playerBallRadius;
    playerBallRightx0 = playerBallLeftx0;
    playerBallRighty0 = playerBallLefty0;
    mainBallX = 0;
    mainBallY = radiusMiddleBall * scaleM;

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
    tau = 1 / (pAir * cw * crossSectionArea);
}

/**
 * --------------------------------- DRAW -----------------------------------
 */

function draw() {

    // Canvas leeren um aufeinanderliegende Zeichnungen zu vermeiden
    clear()

    // ---------------------------- ADMIN ------------------------- //

    // initialize button on new games
    if (gameState == gameStateNew) {
        console.log("gamestate is " + gameState);
        gameState = gameStatePaused;
        button = createButton("START");
        button.position(windowWidth / 10, 9 * windowHeight / 10);
        button.mousePressed(changeGameState);
        console.log("gamestate is " + gameState);

        testButton = createButton("TEST");
        testButton.position(windowWidth / 10 + 75, 9 * windowHeight / 10);
        testButton.mousePressed(startTestModus);
        
        // Platziere alle Eingabeslider für den Testmodus
        positionSliderX = createSlider(-distanceTriangles / 2 * 100, distanceTriangles / 2 * 100, 0, 1);
        positionSliderX.position(8 * windowWidth / 10, 6 * windowHeight / 10);
        positionSliderX.attribute("hidden", "hidden");

        positionSliderY = createSlider(0, 100 * 6 * windowHeight / (7 * scaleM), 20, 1);
        positionSliderY.position(8 * windowWidth / 10, 6.5 * windowHeight / 10);
        positionSliderY.attribute("hidden", "hidden");

        velocitySlider = createSlider(0, 5, 2.5, 0.1);
        velocitySlider.position(8 * windowWidth / 10, 7 * windowHeight / 10);
        velocitySlider.attribute("hidden", "hidden");

        angleSlider = createSlider(0, 360, 90);
        angleSlider.position(8 * windowWidth / 10, 7.5 * windowHeight / 10);
        angleSlider.attribute("hidden", "hidden");

    }

    // Im Test Modus müssen Labels für die Slider angezeigt werden
    if (gameState == gameStateTest || gameState == gameStateTestActive) {
        textSize(16);
        fill('#0000BB');
        text('X-Position: ' + positionSliderX.value() + "cm", 8 * windowWidth / 10, 6 * windowHeight / 10 + 40);
        text('Y-Position: ' + positionSliderY.value() + "cm", 8 * windowWidth / 10, 6.5 * windowHeight / 10 + 40);
        text('Velocity: ' + velocitySlider.value() + 'm/s', 8 * windowWidth / 10, 7 * windowHeight / 10 + 40);
        text('Angle: ' + angleSlider.value() + '°', 8 * windowWidth / 10, 7.5 * windowHeight / 10 + 40);
    }

    // ------------------- BERECHNUNG & DARSTELLUNG --------------- //

    push(); // Start Tiefe: 1
    // Lässt y nach oben positiv steigen
    scale(1, -1);
    // Setzt Mittelpunkt für das Koordinatensystem auf Mitte des Bodens
    translate(windowWidth / 2, -6 * windowHeight / 7);

    // Boden
    line(-windowWidth / 2, 0, windowWidth / 2, 0);

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
                var velocityXLeftBefore = velocityXLeft;
                velocityXLeft -= (velocityXLeft * sqrt(sq(velocityXLeft) + sq(velocityYLeft)) / (2 * tau)) * dt;
                playerBallLeftx += velocityXLeft * dt;
                velocityYLeft -= (velocityYLeft * sqrt(sq(velocityXLeftBefore) + sq(velocityYLeft)) / (2 * tau) + g) * dt;
                playerBallLefty += velocityYLeft * dt;
                break;
            case playStateRolling:
                if (startVelocityRollLeft >= 0) {
                    velocityXLeft = max(0, velocityXLeft + (aRREvenGround * dt));
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
                var velocityXRightBefore = velocityXRight;
                velocityXRight -= (velocityXRight * sqrt(sq(velocityXRight) + sq(velocityYRight)) / (2 * tau)) * dt;
                playerBallRightx += velocityXRight * dt;
                velocityYRight -= (velocityYRight * sqrt(sq(velocityXRightBefore) + sq(velocityYRight)) / (2 * tau) + g) * dt;
                playerBallRighty += velocityYRight * dt;
                break;
            case playStateRolling:
                if (startVelocityRollRight >= 0) {
                    velocityXRight = max(0, velocityXRight + (aRREvenGround * dt));
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
    push(); // Start Tiefe: 2

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
    pop(); // Ende Tiefe: 2

    push();  // Start Tiefe: 2
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
    pop() // Ende Tiefe: 2


    if (gameState == gameStateTest) {
        // Platzierung und Winkelanzeige des Testballs
        testBallX = positionSliderX.value() / 100 * scaleM;
        testBallY = scaleM * (positionSliderY.value() / 100 + playerBallRadius)
        mainBallX = 0;
        mainBallY = radiusMiddleBall * scaleM;

        fill('#000000');
        stroke('#000000');
        strokeWeight(1);
        line(testBallX, testBallY, testBallX + sin((angleSlider.value() + 90) * PI / 180.0) * 75, testBallY + cos((angleSlider.value() + 90) * PI / 180.0) * 75);

        fill('#FF9999');
        stroke('#FF9999');
        strokeWeight(2);
        circle(testBallX, testBallY, scaleM * 2 * playerBallRadius);
    } else if (gameState == gameStateTestActive) {
        // Bewegung des Testballs
        getPlayStateTest();
        switch (playStateTest) {
            case playStateFlying:
                testBallX += velocityXTest * dt;
                testBallY = max(scaleM * playerBallRadius, testBallY + velocityYTest * dt);
                break;
            default:
                testBallX += velocityXTest * dt;
                testBallY += velocityYTest * dt;
                mainBallX += velocityXMain * dt;
                mainBallY += velocityYMain * dt;
                break;

        }

        fill('#FF9999');
        stroke('#FF9999');
        strokeWeight(2);
        circle(testBallX, testBallY, scaleM * 2 * playerBallRadius);

    }

    // Zeichnet den MainBall
    fill('#FFAA77');
    stroke('#000000')
    strokeWeight(1);
    circle(mainBallX, mainBallY, scaleM * 2 * radiusMiddleBall);

    pop()


}

// wird durch button click ausgeführt
// ändert GameState, PlayState und button-text
function changeGameState() {
    console.log("gamestate is " + gameState);
    if (gameState == gameStatePaused) {
        button.html('RESET');
        testButton.attribute("disabled", "disabled");
        gameState = gameStateActive;
    } else if (gameState == gameStateTest) {
        button.html('RESET');
        playStateTest = playStateInactive;
        gameState = gameStateTestActive;
    } else if (gameState == gameStateTestActive) {
        button.html('START');
        playStateTest = playStateInactive;
        gameState = gameStateTest;
    } else {
        button.html('START');
        testButton.removeAttribute("disabled");
        playStateLeft = playStateInactive;
        playStateRight = playStateInactive;
        gameState = gameStatePaused;
        setDefaultValues();
    }
    console.log("gamestate is " + gameState);
}

// startet den Testmodus für Testball Platzierung
function startTestModus() {
    if (gameState == gameStateTest || gameState == gameStateTestActive) {
        gameState = gameStatePaused;
        testButton.html('TEST');
        button.html('START');

        positionSliderX.attribute("hidden", "hidden");
        positionSliderY.attribute("hidden", "hidden");
        velocitySlider.attribute("hidden", "hidden");
        angleSlider.attribute("hidden", "hidden");
    } else if (gameState != gameStateActive && gameState != gameStateTest) {
        gameState = gameStateTest;
        playStateTest = playStateFlying;
        testButton.html('LEAVE TEST');

        positionSliderX.removeAttribute("hidden");
        positionSliderY.removeAttribute("hidden");
        velocitySlider.removeAttribute("hidden");
        angleSlider.removeAttribute("hidden");
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

// untersucht Bewegung des Testballs und geht wenn nötig in den nächsten PlayState über
function getPlayStateTest() {
    
    // setup der Ball-Werte
    if (playStateTest == playStateInactive) {
        testAngle = (angleSlider.value() + 90) * PI / 180.0;
        velocityXTest = velocitySlider.value() * sin(testAngle) * scaleM;
        velocityYTest = velocitySlider.value() * cos(testAngle) * scaleM;
        velocityXMain = 0;
        velocityYMain = 0;
        playStateTest = playStateFlying;
    }
    
    // Berechnung der Tangential- und Zentral-Komponenten um Ergebnisvektoren nach Kollision zu erhalten
    if (playStateTest != playStateAfterCollision && sq(testBallX - mainBallX) + sq(testBallY - mainBallY) <= sq((playerBallRadius + radiusMiddleBall) * scaleM)) {
        
        // Berechnung des Berührungswinkels anhand der Mittelpunkte
        // !! Bei höheren Geschwindigkeiten können hier Fehler entstehen, da der Testball eventuell schon zu weit im Mainball steckt !!
        testAngle = atan((testBallY - mainBallY) / ((testBallX - mainBallX))) - HALF_PI;

        velocityTestTang = velocityXTest * cos(testAngle) + velocityYTest * sin(testAngle);
        velocityTestCent = -velocityXTest * sin(testAngle) + velocityYTest * cos(testAngle);

        velocityMainTang = velocityXMain * cos(testAngle) + velocityYMain * sin(testAngle);
        velocityMainCent = -velocityXMain * sin(testAngle) + velocityYMain * cos(testAngle);

        var velocityTestCent_ = ((playerBallWeight - mainBallWeight) * velocityTestCent + 2 * mainBallWeight * velocityMainCent) / (playerBallWeight + mainBallWeight);
        var velocityTestTang_ = velocityTestTang;

        var velocityMainCent_ = ((mainBallWeight - playerBallWeight) * velocityMainCent + 2 * playerBallWeight * velocityTestCent) / (playerBallWeight + mainBallWeight);
        var velocityMainTang_ = velocityMainTang;

        velocityXTest = velocityTestTang_ * cos(-testAngle) + velocityTestCent_ * sin(-testAngle);
        velocityYTest = -velocityTestTang_ * sin(-testAngle) + velocityTestCent_ * cos(-testAngle);

        velocityXMain = velocityMainTang_ * cos(-testAngle) + velocityMainCent_ * sin(-testAngle);
        velocityYMain = -velocityMainTang_ * sin(-testAngle) + velocityMainCent_ * cos(-testAngle);

        velocityYTest = velocityYTest - velocityYMain;
        velocityYMain = 0;

        playStateTest = playStateAfterCollision;

    } else if (testBallY <= scaleM * playerBallRadius) {
        testBallY = scaleM * playerBallRadius;
        velocityYTest = 0;
        playStateTest = playStateRolling;
    }
    console.log(playStateTest);
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


