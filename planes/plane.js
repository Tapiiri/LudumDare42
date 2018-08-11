let cameraOffset = new Vector(0, 0)
let cameraAcceleration = new Vector(0, 0)
let cameraVelocity = new Vector(0, 0)

function createPlayer(position) {
  const playerGraphics = new createjs.Shape();
  playerGraphics.graphics
    .beginFill('Green')
    .beginStroke('#000000')
    .mt(0, -70)
    .lt(50, 30)
    .lt(-50, 30)
    .lt(0, -70)
    .beginFill('Red')
    .drawCircle(0, 0, 10);
  playerGraphics.x = 0;
  playerGraphics.y = 0;
  return {
    collision: {
      type: "CIRCLE",
      collisionRadius: 10,
      x: position.x,
      y: position.y,
    },
    graphics: playerGraphics,
    position,
    onTick: (ev, self) => {
      applyAngularVelocity(self, ev.delta);
      self.graphics.rotation = radToDeg(self.rotation);

      // drag ~ velocity squared
      const dragCoefficient = 0.005;
      const dragMagnitude = -(self.velocity.toPolar().r ** 2 * dragCoefficient)
      const drag = self.velocity.unit().scalarMult(dragMagnitude);
      self.acceleration = cameraAcceleration = Vector.fromPolar(
        self.accelerationMagnitude,
        self.rotation,
      ).add(drag);
    },
    init: (self) => {
      cameraOffset = new Vector($(window).width() / 2 - self.graphics.x, $(window).height() / 2, self.graphics.y);
      console.log(new Vector($(window).width() / 2 - self.graphics.x, $(window).height() / 2, self.graphics.y));
      const defaultAcceleration = 10;
      const boostAcceleration = 1000;
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
    rotation: 0, // radians, 0 towards the right, grows counterclockwise
    angularVelocity: 0,
    accelerationMagnitude: undefined,
  };
};
