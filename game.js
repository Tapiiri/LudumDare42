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
  const resize = () => {
    stageCanvas.width = stageCanvas.clientWidth;
    stageCanvas.height = stageCanvas.clientHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  let stage = new createjs.Stage('demoCanvas');
  /* gameObject contains:
   *   graphics - EaselJS DisplayObject
   *   onTick - function (tick event, this gameObject)
   *   gravity - Boolean whether to apply gravity
   *   velocity - {x, y} in pixels per second
   *   hitbox - ???
   */
  const gameObjects = [];
  function addGameObject(go) {
    stage.addChild(go.graphics);
    gameObjects.push(go);
  }

  const playerGraphics = new createjs.Shape();
  playerGraphics.graphics
    .beginFill('Green')
    .beginStroke('#000000')
    .mt(50, 0)
    .lt(100, 100)
    .lt(0, 100)
    .lt(50, 0)
    .beginFill('Red')
    .drawCircle(0,0,10);
  playerGraphics.x = 100;
  playerGraphics.y = 100;
  const player = {
    collision: {
      type: "CIRCLE",
      collisionRadius: 10,
      x: 100,
      y: 100,
    },
    graphics: playerGraphics,
    onTick: (ev, self) => (self.graphics.x += 5 * Math.sin(0.005 * ev.time)),
    gravity: true,
    velocity: { x: 0, y: -100 }
  };
  addGameObject(player);

  const groundGraphics = new createjs.Shape();
  groundGraphics.graphics.beginFill('Blue').drawRect(0, 0, 10000, 100);
  groundGraphics.x = 100;
  groundGraphics.y = 600;
  const ground = {
    graphics: groundGraphics,
    onTick: (ev, self) => ({}),
    velocity: { x: 0, y: 0 }
  };
  addGameObject(ground);

  const enemies = [{ size: 50 }, { size: 10 }, { size: 10 }, { size: 10 }];
  enemies.forEach(enemy => {
    const size = enemy.size;
    const enemyGraphics = new createjs.Shape();
    enemyGraphics.graphics
      .beginFill('Violet')
      .beginStroke('#000000')
      .mt(size / 2, 0)
      .lt(size, size)
      .lt(0, size)
      .lt(size / 2, 0)
      .beginFill('Red')
      .drawCircle(0,0,4);
    enemyGraphics.x = Math.random() * 300;
    enemyGraphics.y = Math.random() * 300;
    const enemyObject = {
      collision: {
        type: "CIRCLE",
        collisionRadius: 4,
        x: 100,
        y: 100,
      },
      graphics: enemyGraphics,
      onTick: (ev, self) => {
        self.velocity.x += 5 * Math.sin(0.005 * ev.time);
        self.velocity.y += 5 * Math.cos(0.005 * ev.time);
      },
      gravity: false,
      velocity: { x: 10, y: 10 }
    };
    addGameObject(enemyObject);
  });

  createjs.Ticker.addEventListener('tick', onTick);
  function onTick(ev) {
    gameObjects.forEach(go => {
      applyGravity(go, ev.delta);
      applyVelocity(go, ev.delta);
      go.onTick(ev, go);
    });
    stage.update();
  }

  stage.add;
}

function applyGravity(go, deltaT) {
  const gravityAccelerationY = 98.1; // pixels / s^2
  if (go.gravity) {
    go.velocity.y += (gravityAccelerationY * deltaT) / 1000;
  }
}

function applyVelocity(go, deltaT) {
  go.graphics.x += (go.velocity.x * deltaT) / 1000;
  go.graphics.y += (go.velocity.y * deltaT) / 1000;
}


function circleToCircleCollision(circ0, circ1) {
  return (circ0.collisionRadius + circ1.collisionRadius) < Math.hypot( circ0.x - circ1.x, circ0.y - circ1.y);
}

function RectCircleColliding(circ,rect){
  var distX = Math.abs(circ.x - rect.x-rect.w/2);
  var distY = Math.abs(circ.y - rect.y-rect.h/2);

  if (distX > (rect.w/2 + circ.collisionRadius)) { return false; }
  if (distY > (rect.h/2 + circ.collisionRadius)) { return false; }

  if (distX <= (rect.w/2)) { return true; } 
  if (distY <= (rect.h/2)) { return true; }

  const dx=distX-rect.w/2;
  const dy=distY-rect.h/2;
  return (dx*dx+dy*dy<=(circ.collisionRadius*circ.collisionRadius));
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
