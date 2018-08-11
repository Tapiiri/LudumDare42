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
   *   velocity - vector in pixels per second
   *   acceleration - vector in pixels/s^2
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

  const backgrounGraphics = new createjs.Shape();
  backgrounGraphics.graphics
    .beginFill('Green')
    .drawCircle(Math.random() * 1000, Math.random() * 500, Math.random() * 300)
    .beginFill('Red')
    .drawCircle(Math.random() * 1000, Math.random() * 500, Math.random() * 300)
    .beginFill('Blue')
    .drawCircle(Math.random() * 1000, Math.random() * 500, Math.random() * 300);
  backgrounGraphics.x = 0;
  backgrounGraphics.y = 0;
  stage.addChild(backgrounGraphics);

  const playerGraphics = new createjs.Shape();
  playerGraphics.graphics
    .beginFill('Green')
    .beginStroke('#000000')
    .mt(0, -70)
    .lt(50, 30)
    .lt(-50, 30)
    .lt(0, -70)
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
    onTick: (ev, self) => {
      applyAngularVelocity(self, ev.delta);
      self.graphics.rotation = radToDeg(self.rotation);
      self.acceleration = Vector.fromPolar(
        self.accelerationMagnitude,
        self.rotation,
      );
    },
    init: (self) => {
      const defaultAcceleration = 15;
      const boostAcceleration = 25;
      self.accelerationMagnitude = defaultAcceleration;

      const angularVelocity = Math.PI;
      document.addEventListener('keydown', (ev) => {
        switch (ev.key) {
        case 'ArrowLeft':
          self.angularVelocity = angularVelocity;
          break;
        case 'ArrowRight':
          self.angularVelocity = -angularVelocity;
          break;
        case 'ArrowUp':
          self.accelerationMagnitude = boostAcceleration;
          break;
        }
      });
      document.addEventListener('keyup', (ev) => {
        switch (ev.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          self.angularVelocity = 0;
          break;
        case 'ArrowUp':
          self.accelerationMagnitude = defaultAcceleration;
          break;
        }
      });
    },
    gravity: true,
    velocity: new Vector(0, -10),
    acceleration: new Vector(0, 0),
    maxVelocity: { maxX: 200, minX: -200, maxY: 200, minY: -200 },
    rotation: 0, // radians, 0 towards the right, grows counterclockwise
    angularVelocity: 0,
    accelerationMagnitude: undefined,
  };
  addGameObject(player);

  const groundGraphics = new createjs.Shape();
  groundGraphics.graphics.beginFill('Blue').drawRect(0, 0, 10000, 100);
  groundGraphics.x = 100;
  groundGraphics.y = 600;
  const ground = {
    graphics: groundGraphics,
    onTick: (ev, self) => ({}),
    velocity: new Vector(0, 0),
    acceleration: new Vector(0, 0),
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
      velocity: new Vector(10, 10),
      acceleration: new Vector(0, 0),
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
  const gravityAccelerationY = 8; // pixels / s^2
  if (go.gravity) {
    go.velocity.y += (gravityAccelerationY * deltaT) / 1000;
  }
  go.velocity = go.velocity.add(go.acceleration.scalarMult(deltaT / 1000));
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

function applyAngularVelocity(go, deltaT) {
  go.rotation += go.angularVelocity * deltaT / 1000;
}


function circleToCircleCollision(circ0, circ1) {
  return (circ0.collisionRadius + circ1.collisionRadius) < Math.hypot( circ0.x - circ1.x, circ0.y - circ1.y);
}

function RectCircleColliding(circ,rect){
  const distX = Math.abs(circ.x - rect.x-rect.w/2);
  const distY = Math.abs(circ.y - rect.y-rect.h/2);

  if (distX > (rect.w/2 + circ.collisionRadius)) { return false; }
  if (distY > (rect.h/2 + circ.collisionRadius)) { return false; }

  if (distX <= (rect.w/2)) { return true; } 
  if (distY <= (rect.h/2)) { return true; }

  const dx=distX-rect.w/2;
  const dy=distY-rect.h/2;
  return (dx*dx+dy*dy<=(circ.collisionRadius*circ.collisionRadius));
}

const radToDeg = rad => ((rad - 0.5 * Math.PI) * 180 / Math.PI) + 360
