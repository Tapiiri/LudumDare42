let cameraOffset = new Vector(0, 0)
let cameraAcceleration = new Vector(0, 0)
let cameraVelocity = new Vector(0, 10)

class Plane {
  constructor(position, isPlayer) {
    if (!isPlayer) {
      setShip( this );
    }
    else {
      setPlayerShip( this );
    }

    this.graphics.x = position.x;
    this.graphics.y = position.y;
    this.collision.pos = position;

    this.controlState = {
      left: false,
      right: false,
      up: false,
      shoot: false,
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
  }

  accelerate(accelerationMagnitude) {
    this.accelerationMagnitude = accelerationMagnitude
  }

  contorls(){
    if (this.controlState.left == this.controlState.right){
      this.turn(0);
    }
    else if (this.controlState.left){
      this.turn(-1);
    }
    else if (this.controlState.right){
      this.turn(1)
    }

    if (this.controlState.up){
      this.accelerate( this.boostAcceleration )
    }
    else {
      this.accelerate( this.defaultAcceleration )
    }
  }

  onTick(ev) {
    
    this.contorls()

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


function setShip(ship){
  const shipGraphics = new createjs.Shape();
  shipGraphics.graphics
  .beginFill('Green')
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