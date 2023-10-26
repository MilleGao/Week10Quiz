let song;
let lastFrequency = 0; 
let threshold = 100;

function preload() {
// Set which file extensions to look for (not all browsers support the same extensions)
soundFormats('mp3');
song = loadSound("audio/sample-visualisation.mp3");
img = loadImage("assets/unsplash.jpg")

}
function setup() {
  createCanvas(windowWidth,windowHeight);
  angleMode(DEGREES)
  imageMode(CENTER)
  colorMode(HSB);
  rectMode(CENTER)
  fft = new p5.FFT()

  
}

function draw() {
  // if (getAudioContext().state !== 'running') {//check the audio is processing
  // background(0);
  // fill(255);
  // text('MouseClick', 10, 20, width - 20);
  // // Early exit of the draw loop
  // return;
  // }
  translate(width/2, height/2)
  image(img);
  let spectrum = fft.analyze();
  amp = fft.getEnergy(20, 200)//retrieve frequency
  
  push()
  
  if(amp>230) {
      rotate(random(-1, 1))
  }

  image(img, 0, 0, width, height);
  translate(0, 0);
  pop()

  push()
  let currentFrequency = fft.getCentroid();
  let frequencyDifference = currentFrequency - lastFrequency;

  if (frequencyDifference >= threshold) {

    fill(255);
    stroke(255, 165, 0);
    strokeWeight(2);
    ellipse(random(width/2), random(height/2), 10, 10);
    ellipse(random(-width/2), random(-height/2), 10, 10);
    ellipse(random(-width/2), random(height/2), 15, 15);
    ellipse(random(width/2), random(-height/2), 15, 15);
  }

  pop();
  
  let alpha = map(amp, 0, 255, 100, 255)//affect background img when amplitude changing
  colorMode(RGB);
  fill(15, alpha)
  noStroke()
  rect(0, 0, width, height)
  colorMode(HSB);
  imageMode(CENTER)

  strokeWeight(3)
  noFill()

  for(t=-1;t<=1;t+=2) {//create symmetrical pattern
    for( i = 0; i < spectrum.length/2; i+=5) {
         angle = map(i,0,spectrum.length,0,360)
         amp2 = spectrum[i]
         r = map(amp2, 0, 0, 80, 100) *1.2
        if(i%2) {
            r = map(amp2, 0, 200, 100, 200)*1.5
        }
         x = r * sin(angle)*t ;//x and y coordination of the spectrum
         y = r * cos(angle)+20;
        line(0,0,x,y);
        stroke(i*1.2,255,255);
    }
    console.log(spectrum.length)
}
    

  let nyquist = 22050;

  // get the centroid
  spectralCentroid = fft.getCentroid();

  // The mean_freq_index calculation is for the display.
  let mean_freq_index = spectralCentroid / (nyquist / spectrum.length);

  // Use a log scale to match the energy per octave in the FFT display
  centroidplot = map(log(mean_freq_index), 0, log(spectrum.length), 0, width);

  stroke(255, 255, 255);

  rect(-centroidplot/2, 0, width / spectrum.length, height)
  noStroke();
  fill(100, 0, 255);  
  text('Centroid: ', -50, 400);
  text(round(spectralCentroid) + ' Hz', 50, 400);
  textSize(18);

  if (getAudioContext().state !== 'suspended') {//check the audio is processing
    // background(0);
    fill(255);
    text('Click to change play states!', -100, -350);
    }
}

function mousePressed() {
  if (song.isPlaying()) {
  song.stop();
  } else {
  song.play();

  loop()
  }
  }
  