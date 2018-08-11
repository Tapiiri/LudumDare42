const KEYCODE_ENTER = 13; //useful keycode
const KEYCODE_SPACE = 32; //useful keycode
const KEYCODE_UP = 38; //useful keycode
const KEYCODE_LEFT = 37; //useful keycode
const KEYCODE_RIGHT = 39; //useful keycode
const KEYCODE_DOWN = 40;
const KEYCODE_W = 87; //useful keycode
const KEYCODE_A = 65; //useful keycode
const KEYCODE_D = 68; //useful keycode

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function init() {
  const stageCanvas = document.getElementById('demoCanvas');
  stageCanvas.width = $(window).width();
  stageCanvas.height = $(window).height();
  let stage = new createjs.Stage('demoCanvas');
  stage.w;
  let player = new createjs.Shape();
  player.graphics.beginFill('Red').drawRect(0, 0, 100, 100);
  player.x = $(window).width() / 2;
  player.y = 100;
  stage.addChild(player);
  createjs.Ticker.addEventListener('tick', onTick);
  function onTick(ev) {
    player.x += 5 * Math.sin(0.0005 * ev.time);
    stage.update();
  }

  stage.add;
}

function handleKeyDown(e) {
  if (!e) {
    var e = window.event;
  }
  switch (e.keyCode) {
    case KEYCODE_LEFT:
      return false;
    case KEYCODE_RIGHT:
      return false;
    case KEYCODE_UP:
      return false;
    case KEYCODE_DOWN:
      return false;
  }
}

function handleKeyUp(e) {
  if (!e) {
    var e = window.event;
  }
  switch (e.keyCode) {
    case KEYCODE_LEFT:
      return false;
    case KEYCODE_RIGHT:
      return false;
    case KEYCODE_UP:
      return false;
    case KEYCODE_DOWN:
      return false;
  }
}
