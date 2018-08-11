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
  /* gameObject contains:
   *   graphics - EaselJS DisplayObject
   *   onTick - function (tick event, this gameObject)
   *   gravity - Boolean whether to apply gravity
   *   hitbox - ???
   */
  const gameObjects = [];
  function addGameObject(go) {
    stage.addChild(go.graphics);
    gameObjects.push(go);
  }

  const playerGraphics = new createjs.Shape();
  playerGraphics.graphics
    .beginFill('Red')
    .beginStroke('#000000')
    .mt(50, 0)
    .lt(100, 100)
    .lt(0, 100)
    .lt(50, 0);
  playerGraphics.x = 100;
  playerGraphics.y = 100;
  const player = {
    graphics: playerGraphics,
    onTick: (ev, self) => (self.graphics.x += 5 * Math.sin(0.005 * ev.time)),
    gravity: true
  };
  addGameObject(player);

  createjs.Ticker.addEventListener('tick', onTick);
  function onTick(ev) {
    gameObjects.forEach(go => go.onTick(ev, go));
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
