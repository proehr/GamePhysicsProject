/**
 * @file GTAT2 Game Physics Übung 14
 * @copyright Pauline Röhr 24.02.2021, Matrikelnummer: 569735
 */

/**
 * ------------------------------- DEKLARATION -------------------------------
 * Längenangaben einheitlich, hier in m
 */
var distanceTriangles = 1.2;
var radiusMiddleBall = 0.016;
var lengthSeesaw = 0.25;
var widthTriangles = 0.049;
var heightTriangles = 0.042;
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
var maxVel = 3.6;

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
var playerBallLeftxRollUp
var playerBallLeftyRollUp
var playerBallRightxRollUp
var playerBallRightyRollUp
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
var mainBallDirection;
var leftAngle;
var velocityLeftTang;
var velocityLeftCent;
var rightAngle;
var velocityRightTang;
var velocityRightCent;
var t;
var baseA;
var a;
var aRREvenGroundBase;
var aRREvenGround;
var aRRSlopeBase;
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
var scoreLeft;
var scoreRight;

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
    playerBallLeftx0 = (cos(-rotationMax) * (-seesawMidToPlayerBallMid) - sin(-rotationMax) * playerBallRadius) - distanceTriangles / 2;
    playerBallLeftx = playerBallLeftx0
    playerBallLefty0 = sin(-rotationMax) * (-seesawMidToPlayerBallMid) + cos(-rotationMax) * playerBallRadius + heightTriangles;
    playerBallLefty = playerBallLefty0
    playerBallRightx0 = -playerBallLeftx0;
    playerBallRighty0 = playerBallLefty0;
    playerBallRightx = playerBallLeftx0;
    playerBallRighty = playerBallLefty0;
    mainBallX = 0;
    mainBallY = radiusMiddleBall;
    velocityXMain = 0;
    velocityYMain = 0;

    baseA = g * sin(rotationMax);
    a = baseA;
    aRREvenGroundBase = -g * myRR;
    aRREvenGround = aRREvenGroundBase;
    aRRSlopeBase = -g * cos(rotationMax) * myRR;
    aRRSlope = aRRSlopeBase;
    t = 0;
    pointUp1 = distanceTriangles / 2 - (sqrt(sq(lengthSeesaw / 2) - sq(heightTriangles)));
    pointUp2 = -distanceTriangles / 2 + sqrt(sq(lengthSeesaw / 2) - sq(heightTriangles));
    dt = 1.0 / fr;
    leftUp = 0;
    rightUp = 0;
    crossSectionArea = PI * playerBallRadius * playerBallRadius;
    tau = 1 / (pAir * cw * crossSectionArea);
    
    scoreLeft = 0;
    scoreRight = 0;
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

    // zeigt Spielstand an
    push()
    textSize(22);
    textStyle(BOLD);
    textAlign(CENTER);
    text('Score', windowWidth/2, windowHeight/10)
    text(scoreLeft + ' : ' + scoreRight, windowWidth/2, windowHeight/10 + 40)
    pop()

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
                playerBallLeftx = playerBallLeftx0;
                playerBallLefty = playerBallLefty0;
                break;
            case playStateTouching:
                rotationLeft = -getAngleFromMousePosition();
                angleLeft = rotationMax + rotationLeft;
                playerBallLeftx = (cos(rotationLeft) * (-seesawMidToPlayerBallMid) - sin(rotationLeft) * playerBallRadius) - distanceTriangles / 2;
                playerBallLefty = sin(rotationLeft) * (-seesawMidToPlayerBallMid) + cos(rotationLeft) * playerBallRadius + heightTriangles;
                break;
            case playStateReleased:
                velocity0Left = maxVel * angleLeft / (rotationMax * 2);
                rotationLeft = min(rotationMax, max(-rotationMax, rotationLeft - 2 * velocity0Left / (frameRate() * lengthSeesaw)));
                playerBallLeftx = cos(rotationLeft) * (-seesawMidToPlayerBallMid) - sin(rotationLeft) * playerBallRadius - distanceTriangles / 2;
                playerBallLefty = sin(rotationLeft) * (-seesawMidToPlayerBallMid) + cos(rotationLeft) * playerBallRadius + heightTriangles;
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
                    velocityXLeft = min(0, velocityXLeft - (aRREvenGround * dt));
                }
                playerBallLeftx += velocityXLeft * dt;
                break;
            case playStateRollingUp:
                velocityXLeft += (a + aRRSlope) * dt;
                leftUp += velocityXLeft * dt;
                playerBallLeftx = playerBallLeftxRollUp + leftUp * cos(rotationMax);
                playerBallLefty = playerBallLeftyRollUp + abs(leftUp * sin(rotationMax));
                break;
        }
        // kalkuliert x und y Koordinaten von player ball rechts in Abhängigkeit von PlayStateRight
        switch (playStateRight) {
            case playStateInactive:
                rotationRight = -rotationMax;
                playerBallRightx = playerBallRightx0;
                playerBallRighty = playerBallRighty0;
                break;
            case playStateTouching:
                rotationRight = -getAngleFromMousePosition();
                angleRight = rotationMax + rotationRight;
                playerBallRightx = cos(-rotationRight) * seesawMidToPlayerBallMid - sin(-rotationRight) * playerBallRadius + distanceTriangles / 2;
                playerBallRighty = sin(-rotationRight) * seesawMidToPlayerBallMid + cos(-rotationRight) * playerBallRadius + heightTriangles;
                break;
            case playStateReleased:
                velocity0Right = maxVel * angleRight / (rotationMax * 2);
                rotationRight = min(rotationMax, max(-rotationMax, rotationRight - 2 * velocity0Right / (frameRate() * lengthSeesaw)));
                playerBallRightx = cos(-rotationRight) * seesawMidToPlayerBallMid - sin(-rotationRight) * playerBallRadius + distanceTriangles / 2;
                playerBallRighty = sin(-rotationRight) * seesawMidToPlayerBallMid + cos(-rotationRight) * playerBallRadius + heightTriangles;
                break;
            case playStateFlying:
                var velocityXRightBefore = velocityXRight;
                velocityXRight -= (velocityXRight * sqrt(sq(velocityXRight) + sq(velocityYRight)) / (2 * tau)) * dt;
                playerBallRightx += velocityXRight * dt;
                velocityYRight -= (velocityYRight * sqrt(sq(velocityXRightBefore) + sq(velocityYRight)) / (2 * tau) + g) * dt;
                playerBallRighty += velocityYRight * dt;
                break;
            case playStateRolling:
                if (startVelocityRollRight <= 0) {
                    velocityXRight = min(0, velocityXRight - (aRREvenGround * dt));
                } else {
                    velocityXRight = max(0, velocityXRight + (aRREvenGround * dt));
                }
                playerBallRightx += velocityXRight * dt;
                break;
            case playStateRollingUp:
                velocityXRight += (a + aRRSlope) * dt;
                rightUp += velocityXRight * dt;
                playerBallRightx = playerBallRightxRollUp + rightUp * cos(rotationMax);
                playerBallRighty = playerBallRightyRollUp + abs(rightUp * sin(rotationMax));
                break;
        }
        getPlayStateLeft();
        getPlayStateRight();

        if (velocityXMain != 0 && velocityXMain == abs(velocityXMain) * mainBallDirection) {
            velocityXMain += mainBallDirection * aRREvenGround * dt
        }
        if (abs(velocityXMain) <= 0.01) {
            velocityXMain = 0;
        }
        mainBallX += velocityXMain * dt;
        mainBallY += velocityYMain * dt;
        checkIfScore();
    } else {

        //falls Spiel nicht aktiv: nutze standardwerte
        rotationLeft = -rotationMax;
        rotationRight = -rotationMax;
        playerBallLeftx = playerBallLeftx0;
        playerBallLefty = playerBallLefty0;
        playerBallRightx = playerBallRightx0;
        playerBallRighty = playerBallRighty0;
    }


    // Zeichne linke Wippenelemente

    strokeWeight(1)
    fill('#FF9999');
    stroke('#FF9999');
    // PlayerBall links
    circle(scaleM * playerBallLeftx, scaleM * playerBallLefty, scaleM * playerBallRadius * 2);
    
    // Zielmarkierung links
    stroke('#FF3333')
    strokeWeight(10)
    line(-scaleM * distanceTriangles/3,-5,-scaleM * distanceTriangles/3,-scaleM*playerBallRadius);

    push(); // Start Tiefe: 2

    translate(-scaleM * distanceTriangles / 2, scaleM * heightTriangles);
    rotate(rotationLeft)
    fill('#77AAFF');
    stroke('#77AAFF');
    strokeWeight(2);
    // Wippe mit Halter-Dreieck links
    line(-scaleM * lengthSeesaw / 2, 0, scaleM * lengthSeesaw / 2, 0);
    triangle(scaleM * (-seesawMidToTinyTriangleMid - tinytriangleWidth / 2), 0, scaleM * (-seesawMidToTinyTriangleMid + tinytriangleWidth / 2), 0, scaleM * (-seesawMidToTinyTriangleMid), scaleM * tinyTriangleHeight);


    pop(); // Ende Tiefe: 2

    // Zeichne rechte Wippenelemente;

    strokeWeight(1)
    fill('#FF9999');
    stroke('#FF9999');
    // PlayerBall rechts
    circle(scaleM * playerBallRightx, scaleM * playerBallRighty, scaleM * playerBallRadius * 2);

    // Zielmarkierung rechts
    stroke('#FF3333')
    strokeWeight(10)
    line(scaleM * distanceTriangles/3,-5,scaleM * distanceTriangles/3,-scaleM*playerBallRadius);

    push();  // Start Tiefe: 2

    translate(scaleM * distanceTriangles / 2, scaleM * heightTriangles);
    rotate(-rotationRight)
    fill('#77AAFF');
    stroke('#77AAFF');
    strokeWeight(2);
    // Wippe mit Halter-Dreieck rechts
    line(-scaleM * lengthSeesaw / 2, 0, scaleM * lengthSeesaw / 2, 0);
    triangle(scaleM * (seesawMidToTinyTriangleMid - tinytriangleWidth / 2), 0, scaleM * (seesawMidToTinyTriangleMid + tinytriangleWidth / 2), 0, scaleM * (seesawMidToTinyTriangleMid), scaleM * tinyTriangleHeight);
    pop() // Ende Tiefe: 2


    if (gameState == gameStateTest) {
        // Platzierung und Winkelanzeige des Testballs
        testBallX = positionSliderX.value() / 100;
        testBallY = (positionSliderY.value() / 100 + playerBallRadius)
        mainBallX = 0;
        mainBallY = radiusMiddleBall;

        fill('#000000');
        stroke('#000000');
        strokeWeight(1);
        line(testBallX * scaleM, testBallY * scaleM, testBallX * scaleM + sin((angleSlider.value() + 90) * PI / 180.0) * 75, testBallY * scaleM + cos((angleSlider.value() + 90) * PI / 180.0) * 75);

        fill('#FF9999');
        stroke('#FF9999');
        strokeWeight(2);
        circle(testBallX * scaleM, testBallY * scaleM, scaleM * 2 * playerBallRadius);
    } else if (gameState == gameStateTestActive) {
        // Bewegung des Testballs
        getPlayStateTest();
        switch (playStateTest) {
            case playStateFlying:
                testBallX += velocityXTest * dt;
                testBallY = max(playerBallRadius, testBallY + velocityYTest * dt);
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
        circle(testBallX * scaleM, testBallY * scaleM, scaleM * 2 * playerBallRadius);

    }

    // Zeichnet den MainBall
    fill('#FFAA77');
    stroke('#000000')
    strokeWeight(1);
    circle(scaleM * mainBallX, scaleM * mainBallY, scaleM * 2 * radiusMiddleBall);


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
    if (playStateLeft != playStateAfterCollision && playStateLeft != playStateInactive && sq(playerBallLeftx - mainBallX) + sq(playerBallLefty - mainBallY) <= sq(playerBallRadius + radiusMiddleBall)) {

        // Berechnung des Berührungswinkels anhand der Mittelpunkte
        // !! Bei höheren Geschwindigkeiten können hier Fehler entstehen, da der Testball eventuell schon zu weit im Mainball steckt !!
        leftAngle = atan((playerBallLefty - mainBallY) / ((playerBallLeftx - mainBallX)));

        velocityLeftTang = velocityXLeft * cos(leftAngle) + velocityYLeft * sin(leftAngle);
        velocityLeftCent = -velocityXLeft * sin(leftAngle) + velocityYLeft * cos(leftAngle);

        velocityMainTang = velocityXMain * cos(leftAngle) + velocityYMain * sin(leftAngle);
        velocityMainCent = -velocityXMain * sin(leftAngle) + velocityYMain * cos(leftAngle);

        var velocityLeftCent_ = ((playerBallWeight - mainBallWeight) * velocityLeftCent + 2 * mainBallWeight * velocityMainCent) / (playerBallWeight + mainBallWeight);
        var velocityLeftTang_ = velocityLeftTang;

        var velocityMainCent_ = ((mainBallWeight - playerBallWeight) * velocityMainCent + 2 * playerBallWeight * velocityLeftCent) / (playerBallWeight + mainBallWeight);
        var velocityMainTang_ = velocityMainTang;

        velocityXLeft = velocityLeftTang_ * cos(-leftAngle) + velocityLeftCent_ * sin(-leftAngle);
        velocityYLeft = -velocityLeftTang_ * sin(-leftAngle) + velocityLeftCent_ * cos(-leftAngle);

        velocityXMain = velocityMainTang_ * cos(-leftAngle) + velocityMainCent_ * sin(-leftAngle);
        velocityYMain = -velocityMainTang_ * sin(-leftAngle) + velocityMainCent_ * cos(-leftAngle);

        velocityYLeft = velocityYLeft - velocityYMain;
        velocityYMain = 0;

        mainBallDirection = velocityXMain / abs(velocityXMain);

        playStateLeft = playStateFlying;
        console.log("left: " + playStateLeft);
    }
    if (mouseIsPressed && playStateLeft === playStateInactive && mouseIsInCircle(scaleM * playerBallLeftx0, scaleM * playerBallLefty0, scaleM * radiusTouchSensitivity)) {
        playStateLeft = playStateTouching;
        playStateRight = playStateInactive;
        console.log("left: " + playStateLeft);
    } else if (playStateLeft === playStateTouching && !mouseIsPressed) {
        playStateLeft = playStateReleased;
        console.log("left: " + playStateLeft);
    } else if (playStateLeft === playStateReleased && rotationLeft <= -rotationMax) {
        rotationLeft = -rotationMax;
        velocityXLeft = velocity0Left * cos(HALF_PI - rotationMax);
        velocityYLeft = velocity0Left * sin(HALF_PI - rotationMax);
        playStateLeft = playStateFlying;
        console.log("left: " + playStateLeft);
    } else if (playStateLeft === playStateFlying && playerBallLefty <= playerBallRadius) {
        playerBallLefty = playerBallRadius;
        startVelocityRollLeft = velocityXLeft;
        playStateLeft = playStateRolling;
        console.log("left: " + playStateLeft);
    } else if (playStateLeft === playStateRolling && (playerBallLeftx >= pointUp1 || playerBallLeftx <= pointUp2)) {
        if (playerBallLeftx >= pointUp1) {
            a = -baseA;
            playerBallLeftxRollUp = pointUp1
        } else if (playerBallLeftx <= pointUp2) {
            a = baseA;
            playerBallLeftxRollUp = pointUp2
        }
        playerBallLeftyRollUp = playerBallRadius;
        playStateLeft = playStateRollingUp;
        console.log("left: " + playStateLeft);
    } else if (playStateLeft === playStateRollingUp && playerBallLeftx <= pointUp1 && playerBallLeftx >= pointUp2) {
        startVelocityRollLeft = velocityXLeft;
        if (playerBallLeftx >= pointUp1) {
            playerBallLeftxRollUp = pointUp1
        } else if (playerBallLeftx <= pointUp2) {
            playerBallLeftxRollUp = pointUp2
        }
        playerBallLefty = playerBallRadius;
        playStateLeft = playStateRolling;
        console.log("left: " + playStateLeft);
    }
}

// untersucht Bewegung des rechten PlayerBalls und geht wenn nötig in den nächsten PlayState über
function getPlayStateRight() {
    if (playStateRight != playStateAfterCollision && playStateRight != playStateInactive && sq(playerBallRightx - mainBallX) + sq(playerBallRighty - mainBallY) <= sq(playerBallRadius + radiusMiddleBall)) {

        // Berechnung des Berührungswinkels anhand der Mittelpunkte
        // !! Bei höheren Geschwindigkeiten können hier Fehler entstehen, da der Testball eventuell schon zu weit im Mainball steckt !!
        rightAngle = atan((playerBallRighty - mainBallY) / ((playerBallRightx - mainBallX)));

        velocityRightTang = velocityXRight * cos(rightAngle) + velocityYRight * sin(rightAngle);
        velocityRightCent = -velocityXRight * sin(rightAngle) + velocityYRight * cos(rightAngle);

        velocityMainTang = velocityXMain * cos(rightAngle) + velocityYMain * sin(rightAngle);
        velocityMainCent = -velocityXMain * sin(rightAngle) + velocityYMain * cos(rightAngle);

        var velocityRightCent_ = ((playerBallWeight - mainBallWeight) * velocityRightCent + 2 * mainBallWeight * velocityMainCent) / (playerBallWeight + mainBallWeight);
        var velocityRightTang_ = velocityRightTang;

        var velocityMainCent_ = ((mainBallWeight - playerBallWeight) * velocityMainCent + 2 * playerBallWeight * velocityRightCent) / (playerBallWeight + mainBallWeight);
        var velocityMainTang_ = velocityMainTang;

        velocityXRight = velocityRightTang_ * cos(-rightAngle) + velocityRightCent_ * sin(-rightAngle);
        velocityYRight = -velocityRightTang_ * sin(-rightAngle) + velocityRightCent_ * cos(-rightAngle);

        velocityXMain = velocityMainTang_ * cos(-rightAngle) + velocityMainCent_ * sin(-rightAngle);
        velocityYMain = -velocityMainTang_ * sin(-rightAngle) + velocityMainCent_ * cos(-rightAngle);

        velocityYRight = velocityYRight - velocityYMain;
        velocityYMain = 0;

        mainBallDirection = velocityXMain / abs(velocityXMain);

        playStateRight = playStateFlying;
        console.log("right: " + playStateRight);
    }
    if (mouseIsPressed && playStateRight === playStateInactive && mouseIsInCircle(scaleM * playerBallRightx0, scaleM * playerBallRighty0, scaleM * radiusTouchSensitivity)) {;
        playStateRight = playStateTouching;
        playStateLeft = playStateInactive;
        console.log("right: " + playStateRight);
    } else if (playStateRight === playStateTouching && !mouseIsPressed) {
        playStateRight = playStateReleased;
        console.log("right: " + playStateRight);
    } else if (playStateRight === playStateReleased && rotationRight <= -rotationMax) {
        rotationRight = -rotationMax;
        velocityXRight = -velocity0Right * cos(HALF_PI - rotationMax);
        velocityYRight = velocity0Right * sin(HALF_PI - rotationMax);
        playStateRight = playStateFlying;
        console.log("right: " + playStateRight);
    } else if (playStateRight === playStateFlying && playerBallRighty <= playerBallRadius) {
        playerBallRighty = playerBallRadius;
        startVelocityRollRight = velocityXRight;
        playStateRight = playStateRolling;
        console.log("right: " + playStateRight);
    } else if (playStateRight === playStateRolling && (playerBallRightx >= pointUp1 || playerBallRightx <= pointUp2)) {
        if (playerBallRightx >= pointUp1) {
            a = -baseA;
            playerBallRightxRollUp = pointUp1
        } else if (playerBallRightx <= pointUp2) {
            a = baseA;
            playerBallRightxRollUp = pointUp2
        }
        playerBallRightyRollUp = playerBallRadius;
        playStateRight = playStateRollingUp;
        console.log("right: " + playStateRight);
    } else if (playStateRight === playStateRollingUp && playerBallRightx <= pointUp1 && playerBallRightx >= pointUp2) {
        startVelocityRollRight = velocityXRight;
        if (playerBallRightx >= pointUp1) {
            playerBallRightxRollUp = pointUp1
        } else if (playerBallRightx <= pointUp2) {
            playerBallRightxRollUp = pointUp2
        }
        playerBallRighty = playerBallRadius;
        playStateRight = playStateRolling;
        console.log("right: " + playStateRight);
    }
    
}

// untersucht Bewegung des Testballs und geht wenn nötig in den nächsten PlayState über
function getPlayStateTest() {

    // setup der Ball-Werte
    if (playStateTest == playStateInactive) {
        testAngle = (angleSlider.value() + 90) * PI / 180.0;
        velocityXTest = velocitySlider.value() * sin(testAngle);
        console.log(velocityXTest);
        velocityYTest = velocitySlider.value() * cos(testAngle);
        velocityXMain = 0;
        velocityYMain = 0;
        playStateTest = playStateFlying;
    }

    // Berechnung der Tangential- und Zentral-Komponenten um Ergebnisvektoren nach Kollision zu erhalten
    if (playStateTest != playStateAfterCollision && sq(testBallX - mainBallX) + sq(testBallY - mainBallY) <= sq((playerBallRadius + radiusMiddleBall))) {

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

    } else if (testBallY <= playerBallRadius) {
        testBallY = playerBallRadius;
        velocityYTest = 0;
        playStateTest = playStateRolling;
    }
    console.log(playStateTest);
}


// untersucht ob Mauszeiger im gegebenen Kreis um das Wippenende ist
function mouseIsInCircle(x, y, r) {
    translMouseX = mouseX - windowWidth / 2;
    translMouseY = -mouseY + 6 * windowHeight / 7;
    diffX = translMouseX - x;
    diffY = translMouseY - y;

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


// untersucht ob der MainBall eins der Ziele überschreitet
function checkIfScore() {
    if(mainBallX <= -distanceTriangles/3){
        scoreRight++
        resetToInactive()
    }
    if(mainBallX >= distanceTriangles/3){
        scoreLeft++
        resetToInactive()
    }
}

// setzt alle Bälle zurück
function resetToInactive() {
    mainBallX = 0
    mainBallDirection = 0
    velocityXMain = 0
    playStateLeft = playStateInactive;
    playStateRight = playStateInactive;
}


