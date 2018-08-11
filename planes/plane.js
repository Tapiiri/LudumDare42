let cameraOffset = new Vector(0, 0)
let cameraAcceleration = new Vector(0, 0)
let cameraVelocity = new Vector(0, 10)

class Plane {
  constructor(position) {
    this.graphics = playerGraphics;
    this.graphics.x = position.x;
    this.graphics.y = position.y;

    this.collision = {
      type: "CIRCLE",
      collisionRadius: 10,
      pos: position
    }

    cameraOffset = new Vector($(window).width() / 2 - position.x, $(window).height() / 2, position.y);
    
    self.defaultAcceleration = 10;
    self.boostAcceleration = 1000;
    self.accelerationMagnitude = defaultAcceleration;
    self.angularVelocity = Math.PI;

    document.addEventListener('keydown', (ev) => {
      switch (ev.key) {
        case 'ArrowLeft':
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

  turn(d) {
    this.angularVelocity = angularVelocity;
  }

  onTick(ev) {
    console.log("tikking", this.collision.pos, this.velocity, this.acceleration)
    applyAngularVelocity(this, ev.delta);
    this.graphics.rotation = radToDeg(this.rotation);

    // drag ~ velocity squared
    const dragCoefficient = 0.005;
    const dragMagnitude = -(this.velocity.toPolar().r ** 2 * dragCoefficient)
    const drag = this.velocity.unit().scalarMult(dragMagnitude);
    this.acceleration = cameraAcceleration = Vector.fromPolar(
      this.accelerationMagnitude,
      this.rotation,
    ).add(drag);
  }
}
