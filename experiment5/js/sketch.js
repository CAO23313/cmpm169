let speechRec;
let font;
let speechText = ""; // Variable to store the recognized speech text

function preload() {
  font = loadFont('js/HussarBoldWebEdition-xq5O.otf');
}

function setup() {
  createCanvas(800, 400, WEBGL);
  textFont(font);
  // Create a Speech Recognition object with callback
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  let continuous = true;
  let interimResults = false;
  speechRec.start(continuous, interimResults);
}

function gotSpeech() {
  // When speech is recognized
  if (speechRec.resultValue) {
    speechText = speechRec.resultString; // Update speechText with recognized text
  }
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  push();
  translate(-width / 2, -height / 2); // Adjust for WEBGL coordinate system

  // Static elements (character art)
  textSize(120);
  text('^', 305, 130);
  textSize(15);
  text('[              ]', 302, 73);
  textSize(40);
  text('___', 306, 75);
  text('___', 306, 55);
  textSize(50);
  text('*', 325, 140);
  text('(  )', 302.5, 120);
  text('[  ]', 301.5, 170);
  text('__', 311, 130);
  text('|  |', 310, 260);
  text('|  |', 310, 220);
  text('___________________', 300, 260);
  text('/', 275, 310);
  
  push();
  translate(325, 140);
  rotateY(frameCount / 60);
  text('^', 347, 60);
  textSize(30);
  text('__ __', 325, 20);
  pop();
  
  // Call the wave function multiple times at different positions
  drawWave(600, 390);  
  drawWave(350, 390);
  drawWave(100, 390);
  drawWave(-100, 390);
  drawWave(10, 355);
  drawWave(500, 355);
  drawWave(260, 355);
  
  // Display the recognized speech text with wave effect
  displayWavyText(speechText, 400, 50); // Apply wave effect to speech text

  pop();
}

// Function to display wavy speech text
function displayWavyText(textToDisplay, startX, startY) {
  textSize(12);
  textAlign(CENTER, CENTER);

  // Split the text into words
  let words = textToDisplay.split(' ');
  
  // Iterate through words, adding line breaks every 3 words
  let line = '';
  let yOffset = 0;
  
  for (let i = 0; i < words.length; i++) {
    line += words[i] + ' ';
    
    // If 3 words are accumulated, display the line and reset
    if ((i + 1) % 3 === 0 || i === words.length - 1) {
      displayLineWavy(line.trim(), startX, startY + yOffset);
      line = ''; // Reset line
      yOffset += 20; // Move down for next line
    }
  }
}

// Function to display each line of text with wave effect
function displayLineWavy(line, startX, startY) {
  for (let i = 0; i < line.length; i++) {
    let yOffset = sin(frameCount * 0.05 + i * 0.5) * 5; // Slower wave effect (lower frequency and smaller offset)
    text(line[i], startX + i * 15, startY + yOffset); // Apply wave to each character
  }
}

function drawWave(startX, startY) {
  let waveText = "~~~~~~~~";
  textSize(40);

  for (let i = 0; i < waveText.length; i++) {
    let yOffset = sin(frameCount * 0.1 + i * 0.5) * 10; // Ocean wave animation
    text(waveText[i], startX + i * 30, startY + yOffset);
  }
}




