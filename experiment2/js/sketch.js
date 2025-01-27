// Citation: Professor provide artwork page (http://www.generative-gestaltung.de/2/)
// Citation: ChatGPT help me to modify and understand the code.

var NORTH = 0;
var NORTHEAST = 1;
var EAST = 2;
var SOUTHEAST = 3;
var SOUTH = 4;
var SOUTHWEST = 5;
var WEST = 6;
var NORTHWEST = 7;

var direction;

var stepSize = 1;
var diameter = 1;

var posX;
var posY;

var drawMode = 1;
var counter = 0;

// Store positions and their timestamps
var drawnCircles = [];

// Thunder effect variables
var thunderFrequency = 3000; // Frequency of thunder in milliseconds
var lastThunder = 0;
var thunderDuration = 200; // Duration of the thunder flash in milliseconds
var thunderFlash = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  posX = width / 2;
  posY = height / 2;

  // Optionally load a thunder sound
  // thunderSound = loadSound('thunder.mp3');
}

function draw() {
  background(0, 0, 0, 10); // Gradual fade effect

  // Check if it's time for a thunder strike
  if (millis() - lastThunder > thunderFrequency) {
    thunderFlash = true;
    lastThunder = millis();

    // Optionally, play thunder sound
    // thunderSound.play();
  }

  // Draw existing circles and fade them
  for (let i = drawnCircles.length - 1; i >= 0; i--) {
    let circle = drawnCircles[i];
    let age = millis() - circle.timestamp;

    if (age > 2000) {
      drawnCircles.splice(i, 1); // Remove circles older than 2 seconds
    } else {
      fill(circle.color[0], circle.color[1], circle.color[2], map(age, 0, 2000, 100, 0));
      ellipse(circle.x, circle.y, circle.diameter, circle.diameter);
    }
  }

  for (var i = 0; i <= mouseX; i++) {
    counter++;

    // Randomize direction for next step, but for Mode 2 only diagonal movement from top-left to bottom-right
    if (drawMode == 2) {
      direction = int(random(1, 3));  // Only NORTHEAST (1) or SOUTHEAST (3) are possible
    } else {
      direction = int(random(7));
    }

    if (direction == NORTH) {
      posY -= stepSize;
    } else if (direction == NORTHEAST) {
      posX += stepSize;
      posY -= stepSize;
    } else if (direction == EAST) {
      posX += stepSize;
    } else if (direction == SOUTHEAST) {
      posX += stepSize;
      posY += stepSize;
    } else if (direction == SOUTH) {
      posY += stepSize;
    } else if (direction == SOUTHWEST) {
      posX -= stepSize;
      posY += stepSize;
    } else if (direction == WEST) {
      posX -= stepSize;
    } else if (direction == NORTHWEST) {
      posX -= stepSize;
      posY -= stepSize;
    }

    if (posX > width) posX = 0;
    if (posX < 0) posX = width;
    if (posY < 0) posY = height;
    if (posY > height) posY = 0;

    if (counter % 10 < 2) {
      let circleColor = [192, 100, 64]; // Color of the circle
      drawnCircles.push({
        x: posX + stepSize / 2,
        y: posY + stepSize / 2,
        diameter: diameter,
        color: circleColor,
        timestamp: millis(),
      });
    }

    if (drawMode == 3) {
      if (counter >= 100) {
        counter = 0;
        let circleColor = [192, 100, 64]; // Color of the larger circle
        drawnCircles.push({
          x: posX + stepSize / 3,
          y: posY + stepSize / 2,
          // diameter: diameter + 7,
          color: circleColor,
          timestamp: millis(),
        });
      }
    }
  }

  // Thunder flash effect
  if (thunderFlash) {
    fill(0, 0, 100); // Flash white (lightning)
    rect(0, 0, width, height); // Flash entire screen
    thunderFlash = false;

    // After a short duration, remove the flash
    setTimeout(() => {
      thunderFlash = false;
    }, thunderDuration);
  }
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (keyCode == DELETE || keyCode == BACKSPACE) clear();

  if (key == '1') {
    drawMode = 1;
    stepSize = 1;
    diameter = 1;
  }
  if (key == '2') {
    drawMode = 2;
    stepSize = 1;
    diameter = 1;
  }
  if (key == '3') {
    drawMode = 3;
    stepSize = 10;
    diameter = 5;
  }
}