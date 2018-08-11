let cameraOffset = new Vector(0, 0)
let cameraAcceleration = new Vector(0, 0)
let cameraVelocity = new Vector(0, 10)

class Plane {
  constructor(position) {
    this.graphics = new createjs.Shape();
    this.graphics.graphics
    .beginFill('Green')
    .beginStroke('#000000')
    .mt(0, -70)
    .lt(50, 30)
    .lt(-50, 30)
    .lt(0, -70)
    .beginFill('Red')
    .drawCircle(0, 0, 10);
    this.graphics.x = position.x;
    this.graphics.y = position.y;
    
    this.collision = {
      type: "CIRCLE",
      collisionRadius: 10,
      pos: position
    }

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
      cameraOffset = new Vector($(window).width() / 2 - self.position.x, $(window).height() / 2, self.position.y);
      console.log(new Vector($(window).width() / 2 - self.graphics.x, $(window).height() / 2, self.graphics.y));
      const defaultAcceleration = 10;
      const boostAcceleration = 1000;
      self.accelerationMagnitude = defaultAcceleration;
      const angularVelocity = Math.PI;

    document.addEventListener('keydown', (ev) => {
      switch (ev.key) {
      case 'ArrowLeft':
        this.angularVelocity = angularVelocity;
        break;
      case 'ArrowRight':
        this.angularVelocity = -angularVelocity;
        break;
      case 'ArrowUp':
        this.accelerationMagnitude = boostAcceleration;
        break;
      }
    });
    document.addEventListener('keyup', (ev) => {
        switch (ev.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          this.angularVelocity = 0;
          break;
        case 'ArrowUp':
          this.accelerationMagnitude = defaultAcceleration;
          break;
        }
    });

    this.gravity = true
    this.velocity = new Vector(0, -10)
    this.acceleration = new Vector(0, 0)
    this.rotation = 0 // radians, 0 towards the right, grows counterclockwise
    this.angularVelocity = 0
    this.accelerationMagnitude = 10
  }

  onTick(ev) {
    console.log("tikking", this.collision.pos, this.velocity, this.acceleration)
    applyAngularVelocity(this, ev.delta);
    this.graphics.rotation = radToDeg(this.rotation);

    // drag ~ velocity squared
    const dragCoefficient = 0.005;
    const dragMagnitude = -(this.velocity.toPolar().r ** 2 * dragCoefficient)
    const drag = this.velocity.unit().scalarMult(dragMagnitude);
    this.acceleration = Vector.fromPolar(
      this.accelerationMagnitude,
      this.rotation,
    ).add(drag);
  }
}
