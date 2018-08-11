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


  addGameObject( createPlayer(100, 100) );

  const groundGraphics = new createjs.Shape();
  groundGraphics.graphics.beginFill('Blue').drawRect(0, 0, 10000, 100);
  groundGraphics.x = 100;
  groundGraphics.y = 600;
  const ground = {
    graphics: groundGraphics,
    onTick: (ev, self) => ({}),
    velocity: new Vector(0, 0),
    acceleration: new Vector(0, 0),
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
      .drawCircle(0, 0, 4);
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
  go.graphics.x += (go.velocity.x * deltaT) / 1000;
  go.graphics.y += (go.velocity.y * deltaT) / 1000;
}

function applyAngularVelocity(go, deltaT) {
  go.rotation += go.angularVelocity * deltaT / 1000;
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
