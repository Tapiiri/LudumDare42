let cameraOffset = new Vector(0, 0)
let cameraAcceleration = new Vector(0, 0)
let cameraVelocity = new Vector(0, 10)

class Plane {
  constructor(position, isPlayer) {

    this.controlState = {
      left: false,
      right: false,
      up: false,
      shoot: false,
    }
    this.onTick = this.Tick;

    if (!isPlayer) {
      this.isPlayer = true;
      setShip(this);
      this.controlState.left = true;
      this.controlState.up = true;
    }
    else {
      setPlayerShip(this);
      this.onTick = this.focusTick;
    }

    this.graphics.x = position.x;
    this.graphics.y = position.y;
    this.collision.pos = position;

    this.gravity = true
    this.velocity = new Vector(0, -10)
    this.turnspeed = 3;

    this.defaultAcceleration = 10;
    this.boostAcceleration = 1000;
    this.accelerationMagnitude = this.defaultAcceleration;

    this.acceleration = new Vector(0, 0)
    this.rotation = 0 // radians, 0 towards the right, grows counterclockwise
    this.angularVelocity = 0;

  }

  turn(d) {
    this.angularVelocity = d * this.turnspeed;
  }

  accelerate(accelerationMagnitude) {
    this.accelerationMagnitude = accelerationMagnitude
  }

  controls() {
    if (this.controlState.left == this.controlState.right) {
      this.turn(0);
    }
    else if (this.controlState.left) {
      this.turn(-1);
    }
    else if (this.controlState.right) {
      this.turn(1)
    }

    if (this.controlState.up) {
      this.accelerate(this.boostAcceleration)
    }
    else {
      this.accelerate(this.defaultAcceleration)
    }
  }

  focusTick(ev) {
    this.focusCamera();
    this.Tick(ev);
  }

  focusCamera() {
    cameraOffset = new Vector(
      $(window).width() / 2 - this.collision.pos.x,
      $(window).height() / 2 - this.collision.pos.y);
  }

  Tick(ev) {
    this.controls()

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
    if (this.isPlayer) {
      //cameraAcceleration = this.acceleration;
    }
  }
}


function setShip(ship) {
  const shipGraphics = new createjs.Shape();
  shipGraphics.graphics
    .beginFill('Red')
    .beginStroke('#000000')
    .mt(0, -70)
    .lt(50, 30)
    .lt(-50, 30)
    .lt(0, -70)
    .beginFill('Red')
    .drawCircle(0, 0, 10);

  ship.graphics = shipGraphics;
  ship.collision = {
    type: "CIRCLE",
    collisionRadius: 10,
  }
}