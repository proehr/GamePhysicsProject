/**
 * @file GTAT2 Game Physics Übung 2
 * @copyright Pauline Röhr 15.10.2020, Matrikelnummer: 569735
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

// wiederverwendete Variablen
var scaleM;
var seesawSlope;
var seesawIntercept;

/**
 * --------------------------------- SETUP -----------------------------------
 */

function setup() {
    createCanvas(windowWidth, windowHeight);
    calculateScale();
    calculateFunctionSeesaw();
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

// Berechnet Anstieg und Ordinatenabschnitt der linearen Funktion für die Wippe und speichert beides in die entsprechenden Variablen
function calculateFunctionSeesaw() {
    seesawSlope = heightTriangles / Math.sqrt(Math.pow(lengthSeesaw / 2, 2) - Math.pow(heightTriangles, 2));
    seesawIntercept = heightTriangles - seesawSlope * distanceTriangles / 2;
}

/**
 * --------------------------------- DRAW -----------------------------------
 */

function draw() {
    strokeWeight(1);
    stroke('#000000');

    // Setzt einen neuen Mittelpunkt für das Koordinatensystem und lässt y nach oben positiv steigen
    translate(windowWidth / 2, 6 * windowHeight / 7);
    scale(1, -1);

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

    // Wippe links und rechts
    stroke('#77AAFF');
    strokeWeight(2);
    line(-scaleM * seesawFunctionX(2 * heightTriangles), scaleM * 2 * heightTriangles, -scaleM * seesawFunctionX(0), 0);
    line(scaleM * seesawFunctionX(2 * heightTriangles), scaleM * 2 * heightTriangles, scaleM * seesawFunctionX(0), 0);

}

// Berechnet x-Koordinate der Wippe anhand des gegebenen y-Werts
// Kann später durch andere Wippenfunktion ausgetauscht werden
// Ggfs. nutzen um kleines Dreieck und Kugel auf Wippe zu setzen
function seesawFunctionX(y) {
    return (y - seesawIntercept) / seesawSlope;
}

