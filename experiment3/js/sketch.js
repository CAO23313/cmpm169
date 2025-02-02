let synth, bass, noise, pad, delay, reverb;
let arpeggio = ["C4", "E4", "G4", "B4", "C5", "B4", "G4", "E4"]; // Arpeggiated sequence
let bassNotes = ["C2", "G2", "A2", "F2"]; // Simple bass progression
let arpeggioIndex = 0;
let bassIndex = 0;

// Circle properties
let circleSize = 50; // Initial size of the circle
let maxCircleSize = 200; // Maximum size when pulsing
let pulseSpeed = 0.1; // Speed of the pulse animation

// Audio analysis
let amplitude;
let fft;

// Background style
let backgroundStyle = 1; // 1: Solid, 2: Gradient, 3: Radial Gradient

function setup() {
  createCanvas(600, 600);

  // Lead synth
  synth = new p5.Oscillator('sawtooth');
  synth.start();
  synth.amp(0);

  // Bass synth
  bass = new p5.Oscillator('square');
  bass.start();
  bass.amp(0);

  // Hi-hat / Percussion
  noise = new p5.Noise('white');
  noise.amp(0);
  noise.start();

  // Background pad (smooth ambience)
  pad = new p5.Oscillator('triangle');
  pad.freq(midiToFreq(noteToMidi("C3"))); // Root note for harmony
  pad.amp(0.15);
  pad.start();

  // Effects
  delay = new p5.Delay();
  reverb = new p5.Reverb();

  delay.process(synth, 0.4, 0.3, 2000);
  reverb.process(synth, 2, 1);

  // Audio analysis setup
  amplitude = new p5.Amplitude();
  fft = new p5.FFT();

  setInterval(playArpeggio, 400); // Lead melody every 400ms
  setInterval(playBass, 1600); // Bass note every 1.6 seconds
  setInterval(playPercussion, 200); // Hi-hat every 200ms
  setInterval(modulatePad, 2000); // Slow movement for ambience
}

function draw() {
  // Draw background based on the selected style
  drawBackground();

  // Analyze amplitude and frequency spectrum
  let level = amplitude.getLevel(); // Get current volume level (0 to 1)
  let spectrum = fft.analyze(); // Get frequency spectrum array

  // Map amplitude to circle size
  circleSize = map(level, 0, 1, 50, maxCircleSize);

  // Map frequency spectrum to color
  let lowFreq = fft.getEnergy("bass"); // Bass frequencies
  let midFreq = fft.getEnergy("mid"); // Mid frequencies
  let highFreq = fft.getEnergy("treble"); // High frequencies

  // Use frequencies to control circle color
  let circleColor = color(
    map(lowFreq, 0, 255, 100, 255), // Red based on bass
    map(midFreq, 0, 255, 100, 255), // Green based on mid
    map(highFreq, 0, 255, 100, 255) // Blue based on treble
  );

  // Draw the circle
  noStroke();
  fill(circleColor);
  ellipse(width / 2, height / 2, circleSize, circleSize);

  // Add a ripple effect based on amplitude
  if (level > 0.1) {
    noFill();
    stroke(255, 100);
    strokeWeight(2);
    ellipse(width / 2, height / 2, circleSize * 1.5, circleSize * 1.5);
  }

  // Draw the radio wave at the bottom with gradient colors
  drawRadioWave(spectrum);
}

function drawBackground() {
  // Draw background based on the selected style
  if (backgroundStyle === 1) {
    // Solid background
    background(30); // Dark background
  } else if (backgroundStyle === 2) {
    // Gradient background
    let lowFreq = fft.getEnergy("bass");
    let midFreq = fft.getEnergy("mid");
    let highFreq = fft.getEnergy("treble");

    let color1 = color(
      map(lowFreq, 0, 255, 100, 255), // Red based on bass
      map(midFreq, 0, 255, 100, 255), // Green based on mid
      map(highFreq, 0, 255, 100, 255) // Blue based on treble
    );
    let color2 = color(
      map(highFreq, 0, 255, 100, 255), // Red based on treble
      map(lowFreq, 0, 255, 100, 255), // Green based on bass
      map(midFreq, 0, 255, 100, 255) // Blue based on mid
    );

    for (let y = 0; y < height; y++) {
      let inter = map(y, 0, height, 0, 1);
      let c = lerpColor(color1, color2, inter);
      stroke(c);
      line(0, y, width, y);
    }
  } else if (backgroundStyle === 3) {
    // Radial gradient background
    let lowFreq = fft.getEnergy("bass");
    let midFreq = fft.getEnergy("mid");
    let highFreq = fft.getEnergy("treble");

    let centerColor = color(
      map(lowFreq, 0, 255, 100, 255), // Red based on bass
      map(midFreq, 0, 255, 100, 255), // Green based on mid
      map(highFreq, 0, 255, 100, 255) // Blue based on treble
    );
    let edgeColor = color(
      map(highFreq, 0, 255, 100, 255), // Red based on treble
      map(lowFreq, 0, 255, 100, 255), // Green based on bass
      map(midFreq, 0, 255, 100, 255) // Blue based on mid
    );

    for (let r = 0; r < width / 2; r++) {
      let inter = map(r, 0, width / 2, 0, 1);
      let c = lerpColor(centerColor, edgeColor, inter);
      stroke(c);
      noFill();
      ellipse(width / 2, height / 2, r * 2, r * 2);
    }
  }
}

function drawRadioWave(spectrum) {
  let waveHeight = 100; // Height of the radio wave visualization
  let startY = height - waveHeight; // Y position of the wave

  // Draw the spectrum as a series of bars with gradient colors
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    // Map frequency spectrum to color
    let barColor = color(
      map(i, 0, spectrum.length, 100, 255), // Red gradient
      map(spectrum[i], 0, 255, 100, 255), // Green based on amplitude
      map(i, 0, spectrum.length, 255, 100) // Blue gradient
    );
    fill(barColor);

    // Draw each bar
    let x = map(i, 0, spectrum.length, 0, width); // Map spectrum index to x position
    let h = map(spectrum[i], 0, 255, 0, waveHeight); // Map spectrum value to bar height
    rect(x, startY + waveHeight - h, width / spectrum.length, h);
  }

  // Add a glowing effect for the wave
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = color(100, 200, 255, 100);
}

function keyPressed() {
  // Change background style when keys 1, 2, or 3 are pressed
  if (key === '1') {
    backgroundStyle = 1; // Solid background
  } else if (key === '2') {
    backgroundStyle = 2; // Gradient background
  } else if (key === '3') {
    backgroundStyle = 3; // Radial gradient background
  }
}

function playArpeggio() {
  let note = arpeggio[arpeggioIndex];
  let freq = midiToFreq(noteToMidi(note));

  synth.freq(freq);
  synth.amp(0.6, 0.1);
  setTimeout(() => synth.amp(0, 0.3), 300);

  arpeggioIndex = (arpeggioIndex + 1) % arpeggio.length; // Loop arpeggio
}

function playBass() {
  let note = bassNotes[bassIndex];
  let freq = midiToFreq(noteToMidi(note));

  bass.freq(freq);
  bass.amp(0.5, 0.2);
  setTimeout(() => bass.amp(0, 0.3), 600);

  bassIndex = (bassIndex + 1) % bassNotes.length; // Loop bassline
}

function playPercussion() {
  noise.amp(0.1, 0.02);
  setTimeout(() => noise.amp(0, 0.02), 40);
}

function modulatePad() {
  let newFreq = midiToFreq(noteToMidi(random(["C3", "G3", "A3", "F3"]))); // Chord-like movement
  pad.freq(newFreq);
}

// Converts note name to MIDI value (basic function)
function noteToMidi(note) {
  let notes = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11};
  let pitch = note.slice(0, -1);
  let octave = int(note.slice(-1));
  return (octave + 1) * 12 + notes[pitch];
}