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
   *   init - (optional) function (this gameObject)
   *   gravity - Boolean whether to apply gravity
   *   velocity - {x, y} in pixels per second
   *   acceleration - {x, y} in pixels/s^2
   *   maxVelocity - {maxX, maxY, minX, minY} in pixels/s^2
   *   hitbox - ???
   */
  const gameObjects = [];
  function addGameObject(go) {
    if (typeof go.init === 'function') {
      go.init(go);
    }
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
    onTick: (ev, self) => ({}),
    init: (self) => {
      const acceleration = 120;
      document.addEventListener('keydown', (ev) => {
        switch (ev.key) {
        case 'ArrowLeft':
          self.acceleration.x -= acceleration;
          break;
        case 'ArrowRight':
          self.acceleration.x += acceleration;
          break;
        case 'ArrowUp':
          self.acceleration.y -= acceleration;
          break;
        case 'ArrowDown':
          self.acceleration.y += acceleration;
          break;
        }
      });
      document.addEventListener('keyup', (ev) => {
        switch (ev.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          self.acceleration.x = 0;
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          self.acceleration.y = 0;
          break;
        }
      });
    },
    gravity: true,
    velocity: { x: 0, y: -10 },
    acceleration: { x: 0, y: 0 },
    maxVelocity: { maxX: 50, minX: -50, maxY: 200, minY: -200 },
  };
  addGameObject(player);

  const groundGraphics = new createjs.Shape();
  groundGraphics.graphics.beginFill('Blue').drawRect(0, 0, 10000, 100);
  groundGraphics.x = 100;
  groundGraphics.y = 600;
  const ground = {
    graphics: groundGraphics,
    onTick: (ev, self) => ({}),
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    maxVelocity: { maxX: 0, minX: 0, maxY: 0, minY: 0 },
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
      velocity: { x: 10, y: 10 },
      acceleration: { x: 0, y: 0 },
      maxVelocity: { maxX: 20, minX: -20, maxY: 20, minY: -20 },
    };
    addGameObject(enemyObject);
  });

  createjs.Ticker.addEventListener('tick', onTick);
  function onTick(ev) {
    gameObjects.forEach(go => {
      applyAcceleration(go, ev.delta);
      applyVelocity(go, ev.delta);
      go.onTick(ev, go);
    });
    stage.update();
  }

  stage.add;
}

function applyAcceleration(go, deltaT) {
  const gravityAccelerationY = 100; // pixels / s^2
  if (go.gravity) {
    go.velocity.y += (gravityAccelerationY * deltaT) / 1000;
  }
  go.velocity.x += (go.acceleration.x * deltaT) / 1000;
  go.velocity.y += (go.acceleration.y * deltaT) / 1000;
}

function applyVelocity(go, deltaT) {
  if (go.velocity.x > go.maxVelocity.maxX) {
    go.velocity.x = go.maxVelocity.maxX;
    go.acceleration.x = 0;
  } else if (go.velocity.x < go.maxVelocity.minX) {
    go.velocity.x = go.maxVelocity.minX;
    go.acceleration.x = 0;
  } else if (go.velocity.y > go.maxVelocity.maxY) {
    go.velocity.y = go.maxVelocity.maxY;
    go.acceleration.y = 0;
  } else if (go.velocity.y < go.maxVelocity.minY) {
    go.velocity.y = go.maxVelocity.minY;
    go.acceleration.y = 0;
  }
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
