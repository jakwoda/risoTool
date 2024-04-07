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
let sizeImageText;
let sizeImageValueText;
//selectors

let selcol = [];
let selcolE = [];
let selThres = [];
let selColorName1='MINT';
let selRgb1='130,216,213';
let selRgbA1= [];
let selColorName2='FLUORESCENTRED';
let selRgb2='255,76,101';
let selRgbA2= [];
let selColorName3='FLUORESCENTYELLOW';
let selRgb3='255,233,22';
let selRgbA3= [];
let selColorName4='BLACK';
let selRgb4='0,0,0';
let selRgbA4= [];


let risoButton;


let maxOffset=3;
let mousePosition= [0,0];

function preload() {
img = loadImage('ogRainbow.JPG');
ImageInput = createFileInput(handleFile);
ImageInput.position(60, -5);
}

function setup() {
pixelDensity(1);
createCanvas(297, 420);
image(img, 0, 0, 297, 420);
  canvas.style.margin="35px";
  canvas.style.marginTop="170px";

  c = new Riso(selColorName1);
  m = new Riso(selColorName2);
  y = new Riso(selColorName3);
  k = new Riso(selColorName4);
   noLoop();
   
  //make riso button


  let positionNum=0;
risoButton = createButton('Try it!');
   risoButton.elt.style.backgroundColor="rgb(" +RISOCOLORS[3].color+"";
  risoButton.position(420,positionNum+30);
  risoButton.mousePressed(makeRiso);
  risoButton.elt.style.width='150px';
  risoButton.elt.style.height='40px';
  risoButton.elt.style.borderRadius="20%";




   
  
  //make fake save button

  //  button = createButton('Fake it!');

  // button.position(520, 0);
  // button.mousePressed(fakeRisoSave);
  

  //select dither 
  sel = createSelect();
  risoButton.elt.style.width='150px';
  sel.position(420, positionNum);
  sel.option('atkinson');
  sel.option('bayer');
  sel.option('floydsteinberg');
  sel.option('none');
  sel.selected('floydsteinberg');
  sel.changed(selectDither);


//make size image selector



sizeImage = createSlider(1, 4, 1);
sizeImage.position(420, positionNum+150);
sizeImage.elt.style.width="150px";
// let s = 'export size:x' + sizeImage.value();
fill(50);
// sizeImageText = createButton('ImageSize');
// sizeImageText.position(420, positionNum+170);
sizeImage.changed(resizeImage);


  // make  save button
buttonSave = createButton('Save Image');
buttonSave.position(420, positionNum+120);
buttonSave.elt.style.width="150px";
buttonSave.mousePressed(saveImage);

  
    //make riso export
    button = createButton('Riso Export');
    button.position(420, positionNum+80);
    button.elt.style.width="150px";
    button.mousePressed(exportRiso);


  
  createColorSelectorsPrint();


   //selectors initial set

selcol[1].selected(RISOCOLORS[75].name +" "+ RISOCOLORS[75].color);
selcol[2].selected(RISOCOLORS[78].name +" "+ RISOCOLORS[78].color);
selcol[3].selected(RISOCOLORS[77].name +" "+ RISOCOLORS[77].color);
selcol[4].selected(RISOCOLORS[0].name +" "+ RISOCOLORS[0].color);
selcol[1].elt.style.backgroundColor="rgb(" +RISOCOLORS[75].color+"";
selcol[2].elt.style.backgroundColor="rgb(" +RISOCOLORS[78].color+"";
selcol[3].elt.style.backgroundColor="rgb(" +RISOCOLORS[77].color+"";
selcol[4].elt.style.backgroundColor="rgb(" +RISOCOLORS[0].color+"";
selcol[4].elt.style.color="rgb(" +RISOCOLORS[79].color+"";

extractCMYKChannels();
}
function createColorSelectorsPrint(){


  for (let i = 1; i <= 4; ++i) {
  selcol[i] = createSelect();
for (let j = 0; j < RISOCOLORS.length; j++) {
selcol[i].option(RISOCOLORS[j].name +" "+ RISOCOLORS[j].color);
// selcol[i].position((i-1)*270, 50);
selcol[i].position(60, 35+(i-1)*40);

}

// selcol[i].changed(makeRiso);


selThres[i] = createSlider(0, 255, 130);
selThres[i].position(60, 55+(i-1)*40);



 
}
selcol[1].changed(colorChangedIndicate);
selcol[2].changed(colorChangedIndicate2);
selcol[3].changed(colorChangedIndicate3);
selcol[4].changed(colorChangedIndicate4);
selThres[1].elt.style.display='none';
selThres[2].elt.style.display='none';
selThres[3].elt.style.display='none';
selThres[4].elt.style.display='none';
selThres[1].changed(makeRiso);
selThres[2].changed(makeRiso);
selThres[3].changed(makeRiso);
selThres[4].changed(makeRiso);

 

  // return selcol;
}

function handleFile(file) { 
  if (file.type === 'image') { 
    img = loadImage(file.data, img => {
    // resizeImage();
      image(img, 0, 0, img.width, img.height);
      //check imagesize
 
      risoButton.elt.style.backgroundColor="rgb(" +RISOCOLORS[3].color+"";
      checkImageSize();
      get();

      console.log(pixels)
      filename=file.name;
      console.log(filename)
      extractCMYKChannels();
    });   
  } 
}
function draw() {
  

}

function checkImageSize(){
  if(img.width % 297 == 0 & img.height % 420 == 0){
    risoButton.elt.style.backgroundColor="rgb(" +RISOCOLORS[3].color+"";
    risoButton.elt.innerHTML = "Make it Riso!"
    
    console.log('whaaat')}
  
  else{
    console.log('ziom')
    risoButton.elt.style.backgroundColor="rgb(" +RISOCOLORS[78].color+"";
    risoButton.elt.innerHTML = "file size should be 297x420"

  }
}

function resizeImage(){
  //read imagesizeValue
sizeImageValue=sizeImage.value();

switch (sizeImageValue){
  case 1:
    sizeImageValueText='Small';
    buttonSave.elt.innerHTML = 'Save Small'
    break;
    case 2:
      sizeImageValueText='Medium';
      buttonSave.elt.innerHTML = 'Save Medium'
    break;
    case 3:
        sizeImageValueText='Large';
      buttonSave.elt.innerHTML = 'Save Large'
    break;
    case 4:
      sizeImageValueText='Extra';
      buttonSave.elt.innerHTML = 'Save ExtraLarge'
    break;
}
}
function makeRiso() {
  background(255);
  clearRiso();

  // image(img, 0, 0, img.width, img.height);
     
  //choose layer colors
  c.channelName= selColorName1;
  selRgbA1 = selRgb1.split(",");
  c.channelColor = selRgbA1;
  m.channelName= selColorName2;
  selRgbA2 = selRgb2.split(",");
  m.channelColor = selRgbA2;
  y.channelName= selColorName3;
  selRgbA3 = selRgb3.split(",")
  y.channelColor = selRgbA3;
  k.channelName= selColorName4;
  selRgbA4 = selRgb4.split(",");
  k.channelColor = selRgbA4;


  //dither
  ditheredC = ditherImage(xc, ditherType, selThres[1].value());
  ditheredM = ditherImage(xm, ditherType, selThres[2].value());
  ditheredY = ditherImage(xy, ditherType, selThres[3].value());
  ditheredK = ditherImage(xk, ditherType, selThres[4].value());

  

 
// display images with RandomOffset

  
c0 =c.image(ditheredC, randomOffset(maxOffset), randomOffset(maxOffset), img.width-maxOffset, img.height-maxOffset);
m0= m.image(ditheredM, randomOffset(maxOffset), randomOffset(maxOffset), img.width-maxOffset, img.height-maxOffset);
y0= y.image(ditheredY, randomOffset(maxOffset), randomOffset(maxOffset), img.width-maxOffset, img.height-maxOffset);
k0= k.image(ditheredK,randomOffset(maxOffset),randomOffset(maxOffset), img.width-maxOffset, img.height-maxOffset);
  




  drawRiso();
  // exportRiso();

  //change color of the button and text 
  risoButton.elt.style.backgroundColor="rgb(" +RISOCOLORS[77].color+"";
  risoButton.elt.innerHTML = "switch it up"

}

function selectDither(){
   let item = sel.value();
  ditherType = item;
  makeRiso();
  //dither off
  if(ditherType == "none" || ditherType == "bayer"  ){
selThres[1].elt.style.display='block';
selThres[2].elt.style.display='block';
selThres[3].elt.style.display='block';
selThres[4].elt.style.display='block';
  }
  else{
    selThres[1].elt.style.display='none';
    selThres[2].elt.style.display='none';
    selThres[3].elt.style.display='none';
    selThres[4].elt.style.display='none';
    
  }
}
function colorChangedIndicate(a){
  let selValue= [];
   selValue = selcol[1].value().split(" ");
selColorName1 = selValue[0];
selRgb1 = selValue[1];

  console.log(selColorName1);  
    console.log(selRgb1);  
 
    makeRiso();
// console.log(a.target.style.color);
// if(selRgb1 = "0,0,0"){
 
//   a.target.style.color='256';
//   console.log('black');  
// } else
// {
//   a.target.style.backgroundColor="rgb(" +selRgb1+"";
// }
   a.target.style.backgroundColor="rgb(" +selRgb1+")";
 
}
function colorChangedIndicate2(a){
  let selValue= [];
   selValue = selcol[2].value().split(" ");
selColorName2 = selValue[0];
selRgb2 = selValue[1];
  console.log(selColorName2);  
    console.log(selRgb2);  
// console.log(a.target.style.color);
  a.target.style.backgroundColor="rgb(" +selRgb2+")";
  makeRiso();
}
function colorChangedIndicate3(a){
  let selValue= [];
   selValue = selcol[3].value().split(" ");
selColorName3 = selValue[0];
selRgb3 = selValue[1];

  console.log(selColorName3);  
    console.log(selRgb3);  
// console.log(a.target.style.color);
  a.target.style.backgroundColor="rgb(" +selRgb3+")";
  
  makeRiso();
 
}
function colorChangedIndicate4(a){
  let selValue= [];
   selValue = selcol[4].value().split(" ");
selColorName4 = selValue[0];
selRgb4 = selValue[1];

  console.log(selColorName4);  
    console.log(selRgb4);  
// console.log(a.target.style.color);
  a.target.style.backgroundColor="rgb(" +selRgb4+")";
 
  makeRiso();
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

function saveImage() {

  sizeImageValue=sizeImage.value();
console.log(sizeImageValue);
  resizeCanvas(297*sizeImageValue, 420*sizeImageValue);
  img.resize(297*sizeImageValue, 420*sizeImageValue);
  console.log(img.width);
   
   image(img,0, 0, 297*sizeImageValue, 420*sizeImageValue);
   makeRiso();
saveCanvas('riso'+ sizeImageValueText + '.png'); 

// img.resize(297, 420);
// resizeCanvas(297, 420);
// image(img,0, 0, 297, 420);
// makeRiso();
}  

function extractCMYKChannels(){
    //extract channels from image
    xc = extractCMYKChannel(img, 'cyan');
    xm = extractCMYKChannel(img, 'magenta');
    xy = extractCMYKChannel(img, 'yellow');
    xk = extractCMYKChannel(img, 'black');
}
// resize 

//crop 

// size increment
// let printCanvas = createGraphics(420, 297);
// function mouseDragged(){

//   image(img, mouseX-200, mouseY-200, img.width, img.height);
// mousePosition[0]=mouseX;
// mousePosition[1]=mouseY;
// console.log(mousePosition)

// with(printCanvas) {
//   rectMode(CENTER); // draw rectangles like circles
//   fill(255);
//   rect(width / 2, height / 2, 1000, 1000);
//   image(canvas, width/2, height/2,1000,1000)
// }
// }