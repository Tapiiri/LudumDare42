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

    this.gravity = true
    this.velocity = new Vector(0, -10)
    this.turnspeed = 3;

    this.defaultAcceleration = 10;
    this.boostAcceleration = 1000;
    this.accelerationMagnitude = this.defaultAcceleration;

    this.acceleration = new Vector(0, 0)
    this.rotation = 0 // radians, 0 towards the right, grows counterclockwise
    this.angularVelocity = 0;

    addControls(this);
  }

  turn( d ) {
    this.angularVelocity = d * this.turnspeed;
    console.log(this.angularVelocity)
  }

  accelerate(accelerationMagnitude) {
    this.accelerationMagnitude = accelerationMagnitude
  }

  onTick(ev) {
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
