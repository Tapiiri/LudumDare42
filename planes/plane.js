let cameraOffset = new Vector(0, 0);
let cameraAcceleration = new Vector(0, 0);
let cameraVelocity = new Vector(0, 10);
let playerPosition = new Vector(0, 0);
let playerVelocity = new Vector(0, 10);
let playerAcceleration = new Vector(0, 0);

class Plane {
  constructor(position, isPlayer, addGameObject, removeGameObject) {

    this.controlState = {
      left: false,
      right: false,
      up: false,
      beginNodeLink: false,
      endNodeLink: false
    }
    this.onTick = this.Tick;

    if (!isPlayer) {
      setShip(this);
      this.isPlayer = false;
      this.onTick = this.focusTick;
    }
    else {
      this.isPlayer = true;
      setPlayerShip(this);
      this.onTick = this.focusTick;
    }

    this.graphics.cache(-50, -50, 50 * 2, 50 * 2);

    this.graphics.x = position.x;
    this.graphics.y = position.y;
    this.collision.pos = position;

    this.gravity = true;
    this.velocity = new Vector(0, -10);
    this.turnspeed = 3;

    this.defaultAcceleration = 10;
    this.boostAcceleration = 1000;
    this.accelerationMagnitude = this.defaultAcceleration;

    this.acceleration = new Vector(0, 0)
    this.rotation = 0 // radians, 0 towards the right, grows counterclockwise
    this.angularVelocity = 0;

    this.addGameObject = addGameObject;
    this.removeGameObject = removeGameObject;

    this.nodeLinkWaiting = false;
    this.startNode = null;
    this.nodeLinePairs = [];

  }

  calculateControls() {
    const desiredVelocity = playerPosition.substract(this.collision.pos)
    const angleDiff = normaliseAngle(
      this.rotation - desiredVelocity.toPolar().phi
    );
    this.controlState = {};
    if (angleDiff > 0.3) {
      this.controlState.left = true;
    } else if (angleDiff < -0.3) {
      this.controlState.right = true;
    } else {
      this.controlState.up = true;
    }

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

    if (this.controlState.beginNodeLink && !this.nodeLinkWaiting && !this.controlState.endNodeLink) {
      this.dropNode();
    }

    if (this.controlState.endNodeLink && this.nodeLinkWaiting) {
      this.dropNode();
    } else {
      this.controlState.endNodeLink = false;
    }
  }

  dropNode() {
    if (!this.nodeLinkWaiting) {
      this.startNode = new Node(this.collision.pos, this);
      this.addGameObject(this.startNode);
      this.controlState.endNodeLink = false;
      this.controlState.beginNodeLink = false;
      this.nodeLinkWaiting = true;
    } else {
      const endNode = new Node(this.collision.pos, false);
      this.addGameObject(endNode);
      const line = new Line(this.startNode, endNode, this);
      this.addGameObject(line);
      const newNodeLinePair = [this.startNode, line, endNode]
      this.nodeLinePairs = this.nodeLinePairs.concat([newNodeLinePair]);
      if (this.nodeLinePairs.length > 5) {
        this.removeNodeLinePair(0);
      }
      this.controlState.beginNodeLink = false;
      this.controlState.endNodeLink = false;
      this.nodeLinkWaiting = false;
    }
  }

  removeNodeLinePair(index) {
    this.nodeLinePairs[index].forEach(go => {
      this.removeGameObject(go);
    })
    this.nodeLinePairs.splice(index, 1);
  }

  focusTick(ev) {
    if (this.isPlayer) {
      this.focusCamera();
      playerVelocity = this.velocity;
      playerAcceleration = this.acceleration;
      playerPosition = this.collision.pos;
    } else {
      this.calculateControls()
    }
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
    const dragCoefficient = 0.002;
    const dragMagnitude = -(this.velocity.toPolar().r ** 2 * dragCoefficient)
    const drag = this.velocity.unit().scalarMult(dragMagnitude);
    this.acceleration = Vector.fromPolar(
      this.accelerationMagnitude,
      this.rotation,
    ).add(drag);
  }

  onCollisionWith(that) {
    //console.log(this, 'collided with', that);
  }
}


function setShip(ship) {
  const shipGraphics = new createjs.Shape();
  shipGraphics.graphics
    .beginFill('Red')
    .beginStroke('#000000')
    .mt(0, 50)
    .lt(-40, -30)
    .lt(40, -30)
    .lt(0, 50)
    .beginFill('Red')
    .drawCircle(0, 0, 10);

  ship.graphics = shipGraphics;
  ship.collision = {
    type: "CIRCLE",
    radius: 10,
  }
}
