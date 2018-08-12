function init() {
  const stageCanvas = document.getElementById('demoCanvas');

  let stage = new createjs.Stage('demoCanvas');
  /* gameObject contains:
   *   graphics - EaselJS DisplayObject
   *   onTick - function (tick event, this gameObject)
   *   init - (optional) function (this gameObject)
   *   onCollisionWith - function (that gameObject, this gameObject)
   *   gravity - Boolean whether to apply gravity
   *   velocity - vector in pixels per second
   *   acceleration - vector in pixels/s^2
   *   collision - object consisting of pos (position), and type ('CIRCLE', 'LINE' or 'NONE')
   *               type 'CIRCLE' should contain radius
   *               type 'LINE' should have length and rotation
   */
  const gameObjects = [];
  const addGameObject = function (go) {
    if (typeof go.init === 'function') {
      go.init(go);
    }
    stage.addChild(go.graphics);
    gameObjects.push(go);
  };
  const removeGameObject = function (go) {
    if (typeof go.onDestroy === 'function') {
      go.onDestory(go);
    }
    stage.removeChild(go.graphics);
    const gosId = gameObjects.findIndex(listGo => listGo.graphics.id === go.graphics.id);
    gameObjects.splice(gosId, 1);
  };

  const groundGraphics = new createjs.Shape();
  groundGraphics.graphics.beginFill('Blue').drawRect(0, 0, 10000, 100);
  groundGraphics.x = 0;
  groundGraphics.y = 0;
  const ground = {
    graphics: groundGraphics,
    onTick: (ev, self) => ({}),
    onCollisionWith: (that, self) => console.log('Ground collision!'),
    collision: {
      type: "LINE",
      length: 1000,
      rotation: 0,
      pos: new Vector(0, 0),
    },
    velocity: new Vector(0, 0),
    acceleration: new Vector(0, 0),
  };
  addGameObject(ground);

  const wallGraphics = new createjs.Shape();
  wallGraphics.graphics.beginFill('Black').drawRect(-25, 0, 25, -5000);
  wallGraphics.x = 0;
  wallGraphics.y = 0;
  const wallPrototype = {
    onTick: (ev, self) => ({}),
    onCollisionWith: (that, self) => {
      const elasticity = 0.5;
      that.velocity = that.velocity.scalarMult(elasticity);
      that.velocity.x = -that.velocity.x;
      that.acceleration.x = -that.acceleration.x;
      that.rotation = that.velocity.toPolar().phi;
    },
    collision: {
      type: 'LINE',
      length: 5000,
      rotation: -0.5 * Math.PI,
    },
    velocity: new Vector(0, 0),
    acceleration: new Vector(0, 0),
  }
  const wall1 = $.extend(true, { graphics: wallGraphics.clone(true) }, wallPrototype);
  const wall2 = Object.assign(true, { graphics: wallGraphics.clone(true) }, wallPrototype);
  Object.assign(wall1.collision, { pos: new Vector(0, 2000) });
  Object.assign(wall2.collision, { pos: new Vector(2000, 2000) });
  console.log(wall1.collision);
  addGameObject(wall1);
  addGameObject(wall2);

  const enemies = [{ size: 50 }, { size: 10 }, { size: 10 }, { size: 10 }];
  enemies.forEach(enemy => {
    addGameObject(new Plane(new Vector(Math.random() * 300, -Math.random() * 300), false, addGameObject, removeGameObject));
  });

  addGameObject(new Plane(
    new Vector(50, 0),
    true,
    addGameObject,
    removeGameObject,
    new Vector(stageCanvas.width, stageCanvas.height)
  ));

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
const gravityAccelerationY = 160; // pixels / s^2
const reboundGravityY = -gravityAccelerationY;

function applyCameraAccelerationAndVelocity(deltaT) {
  cameraVelocity.y -= (gravityAccelerationY * deltaT) / 1000;
  cameraVelocity = cameraVelocity.add(cameraAcceleration.opposite().scalarMult(deltaT / 1000));
  cameraOffset = cameraOffset.add(cameraVelocity.scalarMult(deltaT / 1000));
}

function applyAcceleration(go, deltaT) {
  if (go.gravity) {
    go.velocity.y += (
      (go.collision.pos.y <= 0 ? gravityAccelerationY : reboundGravityY)
        * deltaT) / 1000;
  }
  go.velocity = go.velocity.add(go.acceleration.scalarMult(deltaT / 1000));
}

function applyVelocity(go, deltaT) {
  go.collision.pos = go.collision.pos.add(go.velocity.scalarMult(deltaT / 1000));
}

function applyAngularVelocity(go, deltaT) {
  go.rotation += go.angularVelocity * deltaT / 1000;
  go.rotation = normaliseAngle(go.rotation);
}

function updateCameraCoords(go, cameraOffset) {
  const cameraCoords = go.collision.pos.add(cameraOffset);
  go.graphics.x = cameraCoords.x;
  go.graphics.y = cameraCoords.y;
}
function checkCollisions(gos) {
  let i = -1;
  const circleGosSortedByX = gos
    .filter(go => go.collision.type === 'CIRCLE')
    .sort((go1, go2) =>
      (go1.graphics.x - go1.collision.radius) -
      (go2.graphics.x - go2.collision.radius))
    .map(go => { i += 1; return { i, go } });

  const lineGos = gos.filter(go => go.collision.type === 'LINE');

  const circleCollisions = circleGosSortedByX.map(go1 => {
    let breakLoop = false;
    return {
      go1,
      go2s: circleGosSortedByX.slice(go1.i + 1).map(go2 => {
        if (breakLoop)
          return false;
        if (circleToCircleCollision(go1.go.collision, go2.go.collision)) {
          return go2.go;
        }
        breakLoop = true;
        return false;
      }).filter(go => go),
    };
  }).map(({ go1, go2s }) => { return { go1: go1.go, go2s } });

  const circleLineCollisions = circleGosSortedByX.map(go => go.go)
    .map((go1) => {
      return {
        go1,
        go2s: lineGos.filter(
          go2 => circleToLineCollision(go1.collision, go2.collision)
        ),
      }
    });

  const collisions = []
  console.assert(
    circleCollisions.length === circleLineCollisions.length,
    'Collision lists not of equal length',
  )
  for (let i = 0; i < circleCollisions.length; ++i) {
    console.assert(
      circleCollisions[i].go1 === circleLineCollisions[i].go1,
      'Collision lists out of order'
    );
    const go1 = circleCollisions[i].go1;
    const go2s = circleCollisions[i].go2s.concat(circleLineCollisions[i].go2s);
    collisions.push({ go1, go2s });
  }

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

function circleToLineCollision(circ, line) {
  // https://math.stackexchange.com/questions/275529/check-if-line-intersects-with-circles-perimeter
  // ryu jin's answer (Accepted answer is wrong!)
  // Move coordinates s.t. circle is at origin
  const lineStart = line.pos.substract(circ.pos);
  const lineVector = Vector.fromPolar(line.length, line.rotation);
  // Quadratic formula
  const a = line.length ** 2;
  const b = 2 * (lineStart.x * lineVector.x + lineStart.y * lineVector.y);
  const c = (lineStart.toPolar().r ** 2) - (circ.radius ** 2);
  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant <= 0) {
    return false;
  }
  const sqrtdisc = Math.sqrt(discriminant);
  // If the parameter t is within (0, 1), the intersection is within the line segment
  const t1 = (-b + sqrtdisc) / (2 * a);
  const t2 = (-b - sqrtdisc) / (2 * a);
  if ((0 < t1 && t1 < 1) || (0 < t2 && t2 < 1)) {
    return true;
  }
  return false;
}

const normaliseAngle = rad =>
  rad < -Math.PI ? normaliseAngle(rad + 2 * Math.PI) :
    rad > Math.PI ? normaliseAngle(rad - 2 * Math.PI) :
      rad;
const radToDeg = rad => (normaliseAngle(rad - 0.5 * Math.PI) * 180 / Math.PI)
