const height = document.body.clientHeight;
const width = document.body.clientWidth;

const cursor = document.querySelector('#cursor');

const line = document.querySelector('.line');

//GRID
const axisX = document.querySelector('.axisX');
const axisY = document.querySelector('.axisY');

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


  cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) rotateZ(${theta}deg)`;

  //DEBUG VISUALS
  line.style.transform = `rotate(${theta}deg)`;
  line.style.width = d +"px";

  axisX.style.left = `${mouseX}px`;
  axisX.style.height = `${mouseY}px`

  axisY.style.top = `${mouseY}px`;
  axisY.style.width = `${mouseX}px`
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