const windowHeight = $(window).height();
const windowWidth = $(window).width();

const cursor = $("#cursor"),
       box1 = $('.box1'),
       line = $('.line');

//AXIS ASSETS
const axisX = $('.axisX'),
       axisY = $('.axisY'),
       cordX = $(axisX).children('span'),
       cordY = $(axisY).children('span');

var mouseY = 0,
    mouseX = 0;


function positionElement(e) {
  //Get center X and Y of box
  var boxX = window.innerWidth/2;
  var boxY = window.innerHeight/2;

  if (e != null){
    mouseY = e.clientY;
    mouseX = e.clientX;
  }
  
  //Distance mouse-centerBox
  const dx = mouseX - boxX;
  const dy = boxY - mouseY;
  const d = Math.sqrt(dx**2 + dy**2);

  var theta = Math.atan2(-dy, dx);
       theta *= 180 / Math.PI;          
  if (theta < 0) theta += 360;  

  //Cursor visuals
  cursor.css('transform', `translate3d(${mouseX}px, ${mouseY}px, 0) rotateZ(${theta}deg)`);

  //Axis visuals
  // line.css ('transform', `rotate(${theta}deg)`);
  // line.css ('width', d +"px");

  axisX.css ('left', `${mouseX}px`);
  axisX.css ('height', `${mouseY}px`);
  cordX.html(`${mouseX} px`);

  if (mouseX > windowWidth-parseInt(cordX.css('width'))){
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


function animateDiv(){
  var newP = makeNewPosition(); // [0]->Y | [1]->X
  var oldq = box1.offset();
  var speed = calcSpeed([oldq.top, oldq.left], newP);
  
  box1.animate({ top: newP[0], left: newP[1] }, speed, "swing", ()=>{
    animateDiv();        
  });
};

function makeNewPosition(){
  //window sizes
  var y = windowHeight - 50; // 50 is the box width
  var x = windowWidth - 50;

  //new random X and Y inside window
  var nY = Math.floor(Math.random() * y);
  var nX = Math.floor(Math.random() * x);
  
  return [nY,nX];    
}

function calcSpeed(prev, next) {

  var dx = Math.abs(prev[1] - next[1]);
  var dy = Math.abs(prev[0] - next[0]);
  
  var greatest = dx > dy ? dx : dy;
  
  var speedModifier = .2;

  var speed = Math.ceil(greatest/speedModifier);

  return speed;

}
// Start box animation
$(document).ready(()=>{ animateDiv(); });

// Loop to update positions when mouse is not moving
function loop(timestamp) {
  
  positionElement();

  lastRender = timestamp
  window.requestAnimationFrame(loop);
}
var lastRender = 0;
window.requestAnimationFrame(loop);

// Update positions on mousemove
window.addEventListener('mousemove', positionElement);

// Define an array to store shooting boxes
var shootingBoxes = [];

// Shoot rectangle on mouse button press
$(document).on('mousedown', (event) => {
  var shootingBoxTop = mouseY;
  var shootingBoxLeft = mouseX;
  var shootingBoxWidth = 10;
  var shootingBoxHeight = 10;
  var shootingBox = $('<div>')
    .addClass('shooting-box-player')
    .css({
      top: shootingBoxTop + 'px',
      left: shootingBoxLeft + 'px',
      width: shootingBoxWidth + 'px',
      height: shootingBoxHeight + 'px'
    })
    .appendTo('.container');
    
  var angle = Math.atan2(mouseY - (box1.offset().top + box1.height()/2), mouseX - (box1.offset().left + box1.width()/2)); // Calculate the angle between box1 center and the mouse position
  var speed = 5; // Adjust the speed of the shooting box movement

  // Create an object to store the shooting box and its movement information
  var shootingBoxObj = {
    element: shootingBox,
    shooter: 'player',
    top: shootingBoxTop,
    left: shootingBoxLeft,
    angle: angle,
    speed: speed
  };

  // Add the shooting box object to the array
  shootingBoxes.push(shootingBoxObj);
});

function shootBox() {
  var shootingBoxTop = box1.offset().top + box1.height() / 2;
  var shootingBoxLeft = box1.offset().left + box1.width() / 2;
  var shootingBoxWidth = 50;
  var shootingBoxHeight = 50;
  var shootingBox = $('<div>')
    .addClass('shooting-box-enemy')
    .css({
      top: shootingBoxTop + 'px',
      left: shootingBoxLeft + 'px',
      width: shootingBoxWidth + 'px',
      height: shootingBoxHeight + 'px'
    })
    .appendTo('.container');

  var angle = Math.atan2(mouseY - shootingBoxTop, mouseX - shootingBoxLeft); // Calculate the angle between shooting box center and the mouse position
  var speed = 10; // Adjust the speed of the shooting box movement

  // Create an object to store the shooting box and its movement information
  var shootingBoxObj = {
    element: shootingBox,
    shooter: 'enemy',
    top: shootingBoxTop,
    left: shootingBoxLeft,
    angle: angle,
    speed: speed
  };

  // Add the shooting box object to the array
  shootingBoxes.push(shootingBoxObj);

  // Schedule the next shooting after 2 to 3 seconds randomly
  var nextShootDelay = Math.random() * 1000 + 2000;
  setTimeout(shootBox, nextShootDelay);
}

// Start shooting boxes from box1
shootBox();

// Update the position of shooting boxes continuously
function updateShootingBoxes() {
  shootingBoxes.forEach((shootingBoxObj) => {
    if (shootingBoxObj.shooter == 'enemy') {
      shootingBoxObj.top += Math.sin(shootingBoxObj.angle) * shootingBoxObj.speed;
      shootingBoxObj.left += Math.cos(shootingBoxObj.angle) * shootingBoxObj.speed;
    } else {
      shootingBoxObj.top -= Math.sin(shootingBoxObj.angle) * shootingBoxObj.speed;
      shootingBoxObj.left -= Math.cos(shootingBoxObj.angle) * shootingBoxObj.speed;
    }

    shootingBoxObj.element.css({
      top: shootingBoxObj.top + 'px',
      left: shootingBoxObj.left + 'px'
    });

    // Check if the shooting box reaches the boundaries of the window, then remove it
    if (
      shootingBoxObj.top < 0 ||
      shootingBoxObj.top > windowHeight ||
      shootingBoxObj.left < 0 ||
      shootingBoxObj.left > windowWidth
    ) {
      shootingBoxObj.element.remove();
      shootingBoxes.splice(shootingBoxes.indexOf(shootingBoxObj), 1);
    }
  });

  // Repeat the update every 10 milliseconds
  requestAnimationFrame(updateShootingBoxes);
}

// Start updating shooting boxes positions
updateShootingBoxes();