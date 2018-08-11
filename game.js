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
   *   position - vector in world coords
   *   onTick - function (tick event, this gameObject)
   *   init - (optional) function (this gameObject)
   *   gravity - Boolean whether to apply gravity
   *   velocity - vector in pixels per second
   *   acceleration - vector in pixels/s^2
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

  const backgroundColors = ["	#4deeea", "#74ee15", "#ffe700", "#f000ff", "#001eff"]
  const borderColors = ["	#4deeea", "#74ee15", "#ffe700", "#f000ff", "#001eff"]

  for (let index = 0; index < 50; index++) {
    backgroundColors.forEach((f => {
      borderColors.forEach(b => {
        const ball = new createjs.Shape();
        ball.graphics
          .beginFill(f)
          .beginStroke(b)
          .drawCircle(0, 0, Math.random() * 100)
        ball.x = Math.random() * $(window).width();
        ball.y = Math.random() * $(window).height();
        stage.addChild(ball);
      })
    }))
  }

  addGameObject( new Plane(new Vector(100, 100)) );

  const groundGraphics = new createjs.Shape();
  groundGraphics.graphics.beginFill('Blue').drawRect(0, 0, 10000, 100);
  groundGraphics.x = 0;
  groundGraphics.y = 0;
  const ground = {  
    graphics: groundGraphics,
    position: new Vector(100, 600),
    onTick: (ev, self) => ({}),
    velocity: new Vector(0, 0),
    acceleration: new Vector(0, 0),
  };
  // addGameObject(ground);

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
      .drawCircle(0, 0, 4);
    enemyGraphics.x = 0;
    enemyGraphics.y = 0;
    const enemyObject = {
      collision: {
        type: "CIRCLE",
        collisionRadius: 4,
        pos: new Vector(Math.random() * 300, Math.random() * 300),
      },
      graphics: enemyGraphics,
      onTick: (ev, self) => {
        self.velocity.x += 5 * Math.sin(0.005 * ev.time);
        self.velocity.y += 5 * Math.cos(0.005 * ev.time);
      },
      gravity: false,
      velocity: new Vector(10, 10),
      acceleration: new Vector(0, 0),
    };
    addGameObject(enemyObject);
  });
  createjs.Ticker.addEventListener('tick', onTick);
  function onTick(ev) {
    applyCameraAccelerationAndVelocity(ev.delta);
    gameObjects.forEach(go => {
      applyAcceleration(go, ev.delta);
      applyVelocity(go, ev.delta);
      updateCameraCoords(go, cameraOffset);
      go.onTick(ev, go);
    });
    stage.update();
  }

  stage.add;
}
const gravityAccelerationY = 80; // pixels / s^2

function applyCameraAccelerationAndVelocity(deltaT) {
  cameraVelocity.y -= (gravityAccelerationY * deltaT) / 1000;
  cameraVelocity = cameraVelocity.add(cameraAcceleration.opposite().scalarMult(deltaT / 1000));
  cameraOffset = cameraOffset.add(cameraVelocity.scalarMult(deltaT / 1000));
}

function applyAcceleration(go, deltaT) {
  if (go.gravity) {
    go.velocity.y += (gravityAccelerationY * deltaT) / 1000;
  }
  go.velocity = go.velocity.add(go.acceleration.scalarMult(deltaT / 1000));
}

function applyVelocity(go, deltaT) {
  go.collision.pos = go.collision.pos.add(go.velocity.scalarMult(deltaT / 1000));
}

function applyAngularVelocity(go, deltaT) {
  go.rotation += go.angularVelocity * deltaT / 1000;
}

function updateCameraCoords(go, cameraOffset) {
  const cameraCoords = go.collision.pos.add(cameraOffset);
  go.graphics.x = cameraCoords.x;
  go.graphics.y = cameraCoords.y;
}
function checkCollisions(gos) {
  let i = -1;
  gosSortedByX = temp = gos.map(go => { i += 1; return { i, go } }).sort(go1, go2 => (go1.go.graphics.x - go1.go.size.w / 2) - (go2.go.graphics.x - go2.go.size.w / 2));
  collisions = temp.map(go1 => {
    let breakLoop = false;
    return {
      go1, go2: gosSortedByX.drop(go1.i).map(go2 => {
        if (breakLoop)
          return {};
        if (go1.collision.type == "CIRCLE") {
          if (go2.collision.type == "CIRCLE") {
            if (circleToCircleCollision(go1.go, go2.go)) {
              return go2;
            } else {
              breakLoop = true;
            }
          }
        }
        return {};
      }).filter(go => go.collides)
    };
  });
  return collisions;
}


function circleToCircleCollision(circ0, circ1) {
  return (circ0.collisionRadius + circ1.collisionRadius) < Math.hypot(circ0.x - circ1.x, circ0.y - circ1.y);
}

function RectCircleColliding(circ, rect) {
  const distX = Math.abs(circ.x - rect.x - rect.w / 2);
  const distY = Math.abs(circ.y - rect.y - rect.h / 2);

  if (distX > (rect.w / 2 + circ.collisionRadius)) { return false; }
  if (distY > (rect.h / 2 + circ.collisionRadius)) { return false; }

  if (distX <= (rect.w / 2)) { return true; }
  if (distY <= (rect.h / 2)) { return true; }

  const dx = distX - rect.w / 2;
  const dy = distY - rect.h / 2;
  return (dx * dx + dy * dy <= (circ.collisionRadius * circ.collisionRadius));
}

const radToDeg = rad => ((rad - 0.5 * Math.PI) * 180 / Math.PI) + 360
