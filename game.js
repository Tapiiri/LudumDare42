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
   *   onCollisionWith - function (that gameObject, this gameObject)
   *   gravity - Boolean whether to apply gravity
   *   velocity - vector in pixels per second
   *   acceleration - vector in pixels/s^2
   *   collision - object consisting of pos (position), radius, and type ('CIRCLE' or 'NONE')
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
        const ballObject = {
          graphics: ball,
          collision: {
            type: "NONE",
            pos: new Vector(Math.random() * 300, Math.random() * 300),
          },
          onTick: (ev, self) => ({}),
          velocity: new Vector(0, 0),
          acceleration: new Vector(0, 0),
        };
        addGameObject(ballObject);

      })
    }))
  }

  addGameObject(new Plane(new Vector(100, 100), true));

  const groundGraphics = new createjs.Shape();
  groundGraphics.graphics.beginFill('Blue').drawRect(0, 0, 10000, 100);
  groundGraphics.x = 0;
  groundGraphics.y = 0;
  const ground = {
    graphics: groundGraphics,
    onTick: (ev, self) => ({}),
    onCollisionWith: (that, self) => console.log('Ground collision!'),
    collision: {
      type: "CIRCLE",
      radius: 4,
      pos: new Vector(100, 600),
    },
    velocity: new Vector(0, 0),
    acceleration: new Vector(0, 0),
  };
  // addGameObject(ground);

  const enemies = [{ size: 50 }, { size: 10 }, { size: 10 }, { size: 10 }];
  enemies.forEach(enemy => {
    addGameObject(new Plane(new Vector(Math.random() * 300, Math.random() * 300), false));
  });

  createjs.Ticker.addEventListener('tick', onTick);
  function onTick(ev) {
    checkCollisions(gameObjects);
    gameObjects.forEach(go => {
      go.onTick(ev, go);
      applyAcceleration(go, ev.delta);
      applyVelocity(go, ev.delta);
      updateCameraCoords(go, cameraOffset);
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
  const gosSortedByX = gos
        .filter(go => go.collision.type !== 'NONE')
        .sort((go1, go2) =>
            (go1.graphics.x - go1.collision.radius) -
            (go2.graphics.x - go2.collision.radius))
        .map(go => { i += 1; return { i, go } })
  const collisions = gosSortedByX.map(go1 => {
    let breakLoop = false;
    return {
      go1,
      go2s: gosSortedByX.slice(go1.i + 1).map(go2 => {
        if (breakLoop)
          return false;
        if (go1.go.collision.type == "CIRCLE") {
          if (go2.go.collision.type == "CIRCLE") {
            if (circleToCircleCollision(go1.go.collision, go2.go.collision)) {
              return go2.go;
            } else {
              breakLoop = true;
            }
          }
        }
        return false;
      }).filter(go => go),
    };
  }).map(({ go1, go2s }) => { return { go1: go1.go, go2s } });

  collisions.forEach(({ go1, go2s }) => go2s.forEach(go2 => {
    go1.onCollisionWith(go2, go1);
    go2.onCollisionWith(go1, go2);
  }));
}


function circleToCircleCollision(circ0, circ1) {
  const radiiSum = circ0.radius + circ1.radius;
  const distance = circ0.pos.substract(circ1.pos).toPolar().r;
  return radiiSum > distance;
}

const radToDeg = rad => ((rad - 0.5 * Math.PI) * 180 / Math.PI) + 360
