// Citation: The slide about different charts from course lecture
// Citation: My previous experimental 4 about the sound art
// Citation: Free sound from Uppbeat: https://uppbeat.io/sfx/category/hospital/ecg-machine
// Citation: ZZZ Code AI help me to debugging: https://zzzcode.ai
// Citation: ChatGPT help me to modify and understand the code.
// Citation: Deepseek help me to modify and understand the code.

let mic;
let waves = [];
let threshold = 0.02; // Minimum sound level to trigger
let lastSoundTime = 0;
let cooldown = 1500; // 1.5 seconds cooldown
let sound1;

function preload() {
  sound1 = loadSound("sound1.mp3"); // Ensure "sound1.mp3" is in the correct directory
}

function setup() {
  createCanvas(600, 300);
  noFill();

  // Start microphone input
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  let level = mic.getLevel();

  // Create a pulsing background effect using lerpColor for the ECG vibes
  let bgColor = lerpColor(color(0), color(0, 100, 0), constrain(level * 5, 0, 1));
  background(bgColor);

  // Draw ECG grid
  drawGrid();

  // Map the level to a color range from green (low) to red (high)
  let r = map(level, 0, 1, 0, 255);
  let g = map(level, 0, 1, 255, 0);
  stroke(r, g, 0);
  strokeWeight(2);

  // Play sound if the sound level is above the threshold and cooldown has passed
  if (level > threshold && millis() - lastSoundTime > cooldown) {
    sound1.play();
    lastSoundTime = millis();
  }

  // Only add to the wave if the sound level is above the threshold
  if (level > threshold) {
    let waveHeight = map(level, 0, 1, 5, height / 2);
    waves.push(waveHeight);
  } else {
    waves.push(0); // Keep the wave steady when no sound
  }

  if (waves.length > width) {
    waves.shift(); // Keep the wave flowing smoothly
  }

  // Draw wave in ECG monitor style
  if (max(waves) > 0) {
    beginShape();
    for (let i = 0; i < waves.length; i++) {
      let y = height / 2 + sin(i * 0.2) * waves[i];
      vertex(i, y);
    }
    endShape();
  }
}

// Function to draw the ECG grid
function drawGrid() {
  stroke(0, 255, 0, 50); // Light green for grid
  strokeWeight(1);

  // Draw vertical grid lines (every 50 pixels)
  for (let i = 50; i < width; i += 50) {
    line(i, 0, i, height);
  }

  // Draw horizontal grid lines (every 50 pixels)
  for (let i = 50; i < height; i += 50) {
    line(0, i, width, i);
  }
}





