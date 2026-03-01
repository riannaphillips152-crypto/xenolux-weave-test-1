//XENOLUX HARMONIC WEAVE
  // Inspiration: Bach Structure vs Sun Ra Chaos

 // 100 vertical "strings"  act like a digital harp.When it detect frequency , the string doesn't just grow,, it curves and ripples, crossing over other strings to create new "accidental" colors where they intersect.

  //Red/Orange Pulse: The music is heavy on the Bass (Bach's low organ notes or Sun Ra's upright bass).

  //Cyan/Blue Pulse: The music is hitting Mid-range (Vocals or Rhythm Guitar).

  //Purple/Pink Pulse: The music is hitting High Frequencies (Cymbals or Electric Piano shimmers).

let mic, fft;
let isStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  mic = new p5.AudioIn();
  fft = new p5.FFT();
}

function draw() {
  background(0, 0, 5); 

  if (!isStarted) {
    noFill(); stroke(255, 0.3);
    ellipse(width/2, height/2, 50 + sin(frameCount * 5) * 10);
    return;
  }

  let vol = mic.getLevel();
  let spectrum = fft.analyze();
  let wave = fft.waveform(); // The raw sound wave data
  let centroid = fft.getCentroid();
  
  // 1. CHROMA-PULSE: Hue based on pitch
  let hue = map(centroid, 0, 8000, 0, 360);
  let diameter = map(vol, 0, 0.2, 50, height * 0.7);
  
  noFill();
  stroke(hue, 80, 100, 0.5);
  strokeWeight(2);
  ellipse(width / 2, height / 2, diameter);

  // 2. WAVEFORM LINE: The "Bach" Structure
  // This draws the physical vibration of the air
  push();
  noFill();
  stroke(hue, 50, 100, 0.8);
  strokeWeight(map(vol, 0, 0.2, 1, 5));
  beginShape();
  for (let i = 0; i < wave.length; i++) {
    let x = map(i, 0, wave.length, 0, width);
    // The wave values are between -1 and 1
    let y = map(wave[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
  pop();

  // Diagnostics
  fill(hue, 10, 100, 0.5); noStroke(); textAlign(CENTER); textSize(10);
  text("HERTZ CENTROID: " + floor(centroid) + "Hz", width/2, height - 30);
}

function mousePressed() {
  if (!isStarted) {
    userStartAudio();
    mic.start();
    fft.setInput(mic);
    isStarted = true;
    document.getElementById('status').innerText = "SENSORS ACTIVE";
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }