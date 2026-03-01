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
    // Pulsing circle to indicate "Waiting for Click"
    noFill(); 
    stroke(255, 0.3);
    ellipse(width/2, height/2, 50 + sin(frameCount * 0.1) * 10);
    return;
  }

  let vol = mic.getLevel();
  let spectrum = fft.analyze();
  let wave = fft.waveform(); 
  let centroid = fft.getCentroid();
  
  // CHROMA-PULSE: Hue based on pitch
  let hueValue = map(centroid, 0, 8000, 0, 360);
  let diameter = map(vol, 0, 0.2, 50, height * 0.7);
  
  noFill();
  stroke(hueValue, 80, 100, 0.5);
  strokeWeight(2);
  ellipse(width / 2, height / 2, diameter);

  // 2. WAVEFORM LINE: The "Bach" Structure
  push();
  noFill();
  stroke(hueValue, 50, 100, 0.8);
  strokeWeight(map(vol, 0, 0.2, 1, 5));
  beginShape();
  for (let i = 0; i < wave.length; i++) {
    let x = map(i, 0, wave.length, 0, width);
    let y = map(wave[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
  pop();

  // Diagnostics
  fill(hueValue, 10, 100, 0.5); 
  noStroke(); 
  textAlign(CENTER); 
  textSize(12);
  text("HERTZ CENTROID: " + floor(centroid) + "Hz", width/2, height - 30);
}

function mousePressed() {
  if (!isStarted) {
    userStartAudio();
    mic.start();
    fft.setInput(mic);
    isStarted = true;
    document.getElementById('status').innerText = "SENSORS ACTIVE";
    document.getElementById('ui-minimal').style.opacity = "0.3"; // Fade UI when active
  }
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
}