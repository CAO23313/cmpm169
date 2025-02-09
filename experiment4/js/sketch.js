// Citation: The provided artwork page from professor: https://openprocessing.org/sketch/1754173
// Citation: Star Field Hyperdrive Light Speed Effect by Barney Codes: https://www.youtube.com/watch?v=p0I5bNVcYP8
// Citation: ChatGPT help me to modify and understand the code.
// Citation: Deepseek help me to modify and understand the code.

let stars = [];
let planet;
let hyperdrive = false;
let angleHorizontal = 0;
let angleVertical = 0;
let radius = 300;
let lastMouseX = 0;
let lastMouseY = 0;
let hyperdriveSpeed = 1;  // Speed of the hyperdrive effect
let deceleration = 0.2;  // Rate at which the speed decreases when stopping

function setup() {
  createCanvas(800, 600, WEBGL);
  
  // Create random stars with a larger range
  for (let i = 0; i < 100; i++) {
    let star = {
      pos: createVector(random(-1500, 1500), random(-1500, 1500), random(-3000, -1000)),
      history: []
    };
    stars.push(star);
  }

  // Generate a random planet
  planet = {
    pos: createVector(random(-1000, 1000), random(-1000, 1000), random(-3000, -1500)),
    size: random(50, 200),
    color: [random(50, 255), random(50, 255), random(50, 255)]
  };
}

function draw() {
  background(6, 0, 46);
  
  ambientLight(221, 225, 236, 128);
  push();
  noStroke();
  translate(0, 0, 1500);
  
  orbitControl();

  // If hyperdrive is activated, move objects towards the viewer
  if (hyperdrive) {
    hyperdriveSpeed += 0.5;  // Increase acceleration
    if (hyperdriveSpeed > 30) {  // Increase max speed
      hyperdriveSpeed = 30;
    }
  } else {
    if (hyperdriveSpeed > 0) {
      hyperdriveSpeed -= deceleration;
      if (hyperdriveSpeed < 0) {
        hyperdriveSpeed = 0;
      }
    }
  }


  // Move the stars
  for (let i = 0; i < stars.length; i++) {
    stars[i].pos.z += hyperdriveSpeed;

    if (stars[i].pos.z > 0) {
      stars[i].pos = createVector(random(-1500, 1500), random(-1500, 1500), random(-3000, -1000));
      stars[i].history = [];
    }

    stars[i].history.push(stars[i].pos.copy());
    if (stars[i].history.length > 50) {
      stars[i].history.shift();
    }
  }

  // Move the planet like a star
  planet.pos.z += hyperdriveSpeed * 1.5;  // Increase planet movement speed
  for (let i = 0; i < stars.length; i++) {
    stars[i].pos.z += hyperdriveSpeed * 1.5;  // Increase star movement speed
  }


  // Reset planet if it gets too close
  if (planet.pos.z > 0) {
  planet.pos = createVector(random(-1000, 1000), random(-1000, 1000), random(-10000, -5000));
  planet.size = random(50, 200);
  planet.color = [random(50, 255), random(50, 255), random(50, 255)];
}

  // Draw stars
  stroke(255);
  for (let i = 0; i < stars.length; i++) {
    beginShape();
    for (let j = 0; j < stars[i].history.length; j++) {
      let pos = stars[i].history[j];
      vertex(pos.x, pos.y, pos.z);
    }
    endShape();

    push();
    translate(stars[i].pos.x, stars[i].pos.y, stars[i].pos.z);
    point(0, 0);
    pop();
  }

  // Draw the moving planet
  drawPlanet();
  drawMainBody();
  drawEngines();
  drawFuelTanks();
  drawNose();
}


function drawPlanet() {
  push();
  fill(planet.color);
  translate(planet.pos.x, planet.pos.y, planet.pos.z);
  sphere(planet.size);
  pop();
}

function keyPressed() {
  if (key === ' ') {
    hyperdrive = !hyperdrive; // Toggle hyperdrive mode
  }
}


// Control the zoom using the mouse wheel
function mouseWheel(event) {
  radius += event.delta * 0.2;  
  radius = constrain(radius, 100, 500); 
}

// Function to draw the main body
function drawMainBody() {
  push();
  fill(201, 201, 201);
  translate(0, 0, -1500);
  box(100, 50, 200); // Main body
  pop();

  push();
  fill(168, 168, 168);
  translate(30, -30, -1500);
  box(20, 10, 150); // Main body
  pop();

  push();
  fill(125, 125, 125);
  translate(-30, -30, -1500);
  box(30, 10, 50); // Main body
  pop();

  push();
  fill(61, 61, 61);
  translate(0, 30, -1490);
  box(80, 10, 180); // Main body
  pop();

  push();
  fill(125, 125, 125);
  translate(0, 0, -1615);
  box(100, 40, 30); // Main body
  pop();

  push();
  fill(121, 155, 189);
  translate(30, 0, -1630);
  box(30, 20, 20); // Main body
  pop();

  push();
  fill(125, 125, 125);
  translate(0, 0, -1390);
  box(60, 30, 20); // Main body
  pop();
}

// Function to draw the nose
function drawNose() {
  push();
  fill(220, 255, 252);
  translate(0, 0, -1435);
  torus(80, 15); // Nose 
  pop();
}

// Function to draw the engines
function drawEngines() {
  push();
  fill(201, 201, 201);
  translate(-60, 0, -1400);
  rotateX(PI / 2);
  cylinder(20, 100); // Left engine
  pop();

  push();
  fill(173, 173, 173);
  translate(-60, 0, -1450);
  rotateY(PI / 3);
  cylinder(20, 40); // Left engine
  pop();

  push();
  fill(201, 201, 201);
  translate(60, 0, -1400);
  rotateX(PI / 2);
  cylinder(20, 100); // Right engine
  pop();

  push();
  fill(173, 173, 173);
  translate(60, 0, -1450);
  rotateY(PI / 3);
  cylinder(20, 40); // Left engine
  pop();

  push();
  fill(122, 122, 122);
  translate(60, 0, -1350);
  rotateX(PI / 2);
  cone(20, 100); // Right engine2
  pop();

  push();
  fill(122, 122, 122);
  translate(-60, 0, -1350);
  rotateX(PI / 2);
  cone(20, 100); // Left engine2
  pop();
}

// Function to draw the fuel tanks
function drawFuelTanks() {
  push();
  fill(78, 122, 168);
  translate(60, 0, -1540);
  box(20, 20, 100); // Right fuel tank
  pop();

  push();
  fill(78, 122, 168);
  translate(-60, 0, -1540);
  box(20, 20, 100); // Right fuel tank
  pop();

  push();
  fill(217, 183, 76);
  translate(-60, 10, -1620);
  box(10, 10, 100); // Right fuel tank
  pop();

  push();
  fill(217, 183, 76);
  translate(60, 10, -1620);
  box(10, 10, 100); // Right fuel tank
  pop();
}
