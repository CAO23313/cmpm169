var tileCount = 8; // Fixed tile count
var moduleColor;
var moduleAlpha = 180;
var maxDistance = 500;
var gridMode = 1; // 1 = Square Matrix, 2 = Hollow Circle, 3 = Hollow Star

function setup() {
  createCanvas(600, 600);
  noFill();
  strokeWeight(3);
}

function draw() {
  clear();

  // Update color dynamically based on mouseY
  colorMode(HSB, 360, 100, 100);
  var hueValue = map(mouseY, 0, height, 0, 360); // Map mouseY to hue range
  moduleColor = color(hueValue, 100, 100, moduleAlpha); // Set new moduleColor
  stroke(moduleColor);

  // Set the background to the opposite color
  var oppositeHue = (hueValue + 180) % 360; // Opposite hue (180 degrees apart)
  var oppositeColor = color(oppositeHue, 100, 100); // Full saturation, full brightness
  background(oppositeColor); // Set the background color

  var step = width / tileCount; // Calculate step size based on tile count

  for (var gridY = 0; gridY < height; gridY += step) {
    for (var gridX = 0; gridX < width; gridX += step) {
      var diameter = dist(mouseX, mouseY, gridX, gridY);
      diameter = diameter / maxDistance * step; // Scale diameter based on step size

      push();
      translate(gridX, gridY);

      // Rotate each tile for a kaleidoscope effect
      var angle = atan2(gridY - height / 2, gridX - width / 2);
      rotate(angle);

      if (gridMode === 1) {
        // Regular Square Matrix
        rect(0, 0, diameter, diameter);
      } else if (gridMode === 2) {
        // Hollow Circle
        ellipse(0, 0, diameter, diameter);
        fill(255); // Set fill color to white for hollow effect
        noStroke();
        ellipse(0, 0, diameter / 2, diameter / 2); // Inner circle for hollow effect
        noFill();
        stroke(moduleColor);
      } else if (gridMode === 3) {
        // Hollow Star
        drawStar(0, 0, diameter / 2, diameter / 4, 5); // Outer star
        fill(255); // Inner hollow star color (background)
        noStroke();
        drawStar(0, 0, diameter / 4, diameter / 8, 5); // Inner hollow part
        noFill();
        stroke(moduleColor);
      }

      // Reflect the grid to mimic kaleidoscope pattern
      for (var i = 1; i < 4; i++) {
        push();
        rotate(PI / 2 * i); // Rotate the reflection
        if (gridMode === 1) {
          rect(0, 0, diameter, diameter);
        } else if (gridMode === 2) {
          ellipse(0, 0, diameter, diameter);
          fill(255);
          noStroke();
          ellipse(0, 0, diameter / 2, diameter / 2);
          noFill();
          stroke(moduleColor);
        } else if (gridMode === 3) {
          drawStar(0, 0, diameter / 2, diameter / 4, 5);
          fill(255);
          noStroke();
          drawStar(0, 0, diameter / 4, diameter / 8, 5);
          noFill();
          stroke(moduleColor);
        }
        pop();
      }

      pop();
    }
  }
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius1;
    let sy = y + sin(a) * radius1;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius2;
    sy = y + sin(a + halfAngle) * radius2;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');

  // Switch to Square Matrix Mode
  if (key == '1') {
    gridMode = 1;
  }

  // Switch to Hollow Circle Mode
  if (key == '2') {
    gridMode = 2;
  }

  // Switch to Hollow Star Mode
  if (key == '3') {
    gridMode = 3;
  }
}
