const height = $(window).height();
const width = $(window).width();

const cursor = $("#cursor");

const line = $('.line');

//GRID
const axisX = $('.axisX');
const axisY = $('.axisY');
const cordX = $(axisX).children('span');
const cordY = $(axisY).children('span');

//centerScreen
const box1 = $('.box1');

let mouseY = 0;
let mouseX = 0;


const positionElement = (e)=> {
  let boxX = getLeft(box1) + box1.width()/2;
  let boxY = getTop(box1) + box1.height()/2;

  if (e != null){
    mouseY = e.clientY;
    mouseX = e.clientX;
  }
  
  //Distance mouse-center
  const dx = mouseX - boxX;
  const dy = boxY - mouseY;
  const d = Math.sqrt(dx**2 + dy**2);

  var theta = Math.atan2(-dy, dx);
       theta *= 180 / Math.PI;          
  if (theta < 0) theta += 360;  


  cursor.css('transform', `translate3d(${mouseX}px, ${mouseY}px, 0) rotateZ(${theta}deg)`);

  //DEBUG VISUALS
  line.css ('transform', `rotate(${theta}deg)`);
  line.css ('width', d +"px");

  axisX.css ('left', `${mouseX}px`);
  axisX.css ('height', `${mouseY}px`);
  cordX.html(`${mouseX} px`);

  if (mouseX > width-parseInt(cordX.css('width'))){
    cordX.css('left', '-100px');
  } else {
    cordX.css('left', '0');
  }

  axisY.css ('top', `${mouseY}px`);
  axisY.css ('width', `${mouseX}px`);
  cordY.html(`${mouseY} px`);
  
  if (mouseY > 0 + parseInt(cordX.css('height'))*2){
    cordY.css('top', '-20px');
  } else {
    cordY.css('top', '0');
  }
}


function getLeft(element){
  return element.offset().left
}

function getTop(element){
  return element.offset().top;
}


function makeNewPosition(){
  //window sizes
  var h = $(window).height() - 50;
  var w = $(window).width() - 50;

  //new random X and Y inside window
  var nh = Math.floor(Math.random() * h);
  var nw = Math.floor(Math.random() * w);
  
  return [nh,nw];    
}


function animateDiv(){
  var newP = makeNewPosition();
  var oldq = box1.offset();
  var speed = calcSpeed([oldq.top, oldq.left], newP);
  
  box1.animate({ top: newP[0], left: newP[1] }, speed, "swing", function(){
    animateDiv();        
  });
};

function calcSpeed(prev, next) {
  
  var x = Math.abs(prev[1] - next[1]);
  var y = Math.abs(prev[0] - next[0]);
  
  var greatest = x > y ? x : y;
  
  var speedModifier = .2;

  var speed = Math.ceil(greatest/speedModifier);

  return speed;

}

$(document).ready(function(){
  animateDiv();
});


window.addEventListener('mousemove', positionElement);

function loop(timestamp) {
  var dt = (timestamp - lastRender)/100;
  
  positionElement();

  lastRender = timestamp
  window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);