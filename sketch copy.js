let img;
let c, m, y, k;
let c0, m0, y0, k0;
let filename;
let xr, xg, xb, xc, xm, xy, xk;
let ditheredC,ditheredM,ditheredY,ditheredK;
let sel;
// let ditherType = 'atkinson';
// let ditherType = 'bayer';
let ditherType = 'floydsteinberg';
// let ditherType = 'none';
let threshold;
let thresholdValue;
  let selcol = [];
  let selcolE = [];
let selThres = [];


  let maxOffset=3;

function preload() {
  img = loadImage('ogRainbow.JPG');
    // img = loadImage('chairman 2.jpg')
 
  ImageInput = createFileInput(handleFile);

ImageInput.position(0, 0);
}

function setup() {
  pixelDensity(1);
  createCanvas(img.width, img.height);
   noLoop();
  //make riso button
   button = createButton('Make It Riso!');
  button.position(200, 0);
  button.mousePressed(makeRiso);
  //select dither 
  sel = createSelect();
  sel.position(300, 0);
  sel.option('atkinson');
  sel.option('bayer');
  sel.option('floydsteinberg');
  sel.option('none');
  sel.selected('floydsteinberg');
  sel.changed(selectDither);
  
    //make riso export
  button = createButton('Riso Export');
  button.position(420, 0);
  button.mousePressed(exportRiso);
   //make fake save button
   button = createButton('Fake it!');

  button.position(520, 0);
  button.mousePressed(fakeRisoSave);
  //make threshold slider
// threshold = createSlider(0, 255, 130);
// threshold.position(600, 0);
sizeImage = createSlider(1, 4, 2);
sizeImage.position(580, 0);
  
  createColorSelectorsPrint();
   // createColorSelectorsExtract();


}
function createColorSelectorsPrint(){


  for (let i = 1; i <= 4; ++i) {
  selcol[i] = createSelect();
for (let j = 0; j < RISOCOLORS.length; j++) {
selcol[i].option(RISOCOLORS[j].name);
selcol[i].position((i-1)*150, 50);
}

// selcol[i].changed(makeRiso);
selThres[i] = createSlider(0, 255, 130);
selThres[i].position((i-1)*150, 70)
}
  selcol[1].selected('mint');
  selcol[2].selected('magenta');
  selcol[3].selected('yellow');
  selcol[4].selected('black');
  // return selcol;
}


 
function handleFile(file) { 
  if (file.type === 'image') { 
    img = loadImage(file.data, img => {
      sizeImageValue=sizeImage.value();
        img.resize(297*sizeImageValue, 420*sizeImageValue);
       resizeCanvas(img.width, img.height);
      image(img, 0, 0, img.width, img.height);
     
      get();

      console.log(pixels)
      filename=file.name;
      console.log(filename)
    });   
  } 
}
function draw() {

}

function makeRiso() {
  // thresholdValue=threshold.value()
  // console.log(thresholdValue);
  background(255);
  clearRiso();
  //choose layer colors
  c = new Riso(selcol[1].value());
  m = new Riso(selcol[2].value());
  y = new Riso(selcol[3].value());
  k = new Riso(selcol[4].value());
  //extract channels from image
  xc = extractCMYKChannel(img, 'cyan');
  xm = extractCMYKChannel(img, 'magenta');
  xy = extractCMYKChannel(img, 'yellow');
  xk = extractCMYKChannel(img, 'black');
  //dither
  ditheredC = ditherImage(xc, ditherType, selThres[1].value());
  ditheredM = ditherImage(xm, ditherType, selThres[2].value());
  ditheredY = ditherImage(xy, ditherType, selThres[3].value());
  ditheredK = ditherImage(xk, ditherType, selThres[4].value());

  

 
// display images with RandomOffset

  
c0 =c.image(ditheredC, randomOffset(maxOffset), randomOffset(maxOffset), width-maxOffset, height-maxOffset);
m0= m.image(ditheredM, randomOffset(maxOffset), randomOffset(maxOffset), width-maxOffset, height-maxOffset);
y0= y.image(ditheredY, randomOffset(maxOffset), randomOffset(maxOffset), width-maxOffset, height-maxOffset);
k0= k.image(ditheredK,randomOffset(maxOffset),randomOffset(maxOffset), width-maxOffset, height-maxOffset);
  




  drawRiso();
  // exportRiso();
 
}

function selectDither(){
   let item = sel.value();
  ditherType = item;
}


function randomOffset(offset){
  let rOf = random (-offset,offset);
  return rOf;
}

function fakeRisoSave(){
  console.log(c);
   c0.save(filename + '_cyan', 'png');
  m0.save(filename + '_magenta', 'png');
  y0.save(filename + '_yellow', 'png');
  k0.save(filename + '_key', 'png');
}


