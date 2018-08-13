let cameraOffset = new Vector(0, 0);
let cameraAcceleration = new Vector(0, 0);
let cameraVelocity = new Vector(0, 10);
let playerPosition = new Vector(0, 0);
let playerVelocity = new Vector(0, 10);
let playerAcceleration = new Vector(0, 0);

class Plane {
  constructor(position, isPlayer, addGameObject, removeGameObject, canvasSize) {

    this.canvasSize = canvasSize;
    this.controlState = {
      left: false,
      right: false,
      up: false,
      beginNodeLink: false,
      endNodeLink: false,
      shoot: false
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
    this.boostAcceleration = 5000;
    this.power = this.defaultAcceleration;

    this.acceleration = new Vector(0, 0)
    this.rotation = 0 // radians, 0 towards the right, grows counterclockwise
    this.angularVelocity = 0;

    this.addGameObject = addGameObject;
    this.removeGameObject = removeGameObject;

    this.nodeLinkWaiting = false;
    this.startNode = null;
    this.nodeLinePairs = [];

    this.fireRate = 200;
    this.canFire = 1; //true

  }

  calculateControls() {
    const desiredVelocity = playerPosition.add(playerVelocity.add(playerAcceleration).scalarMult(2)).substract(this.collision.pos)
    const angleDiff = normaliseAngle(
      this.rotation - desiredVelocity.toPolar().phi
    );
    this.controlState = {};
    if (angleDiff > 0.3) {
      this.controlState.endNodeLink = true;
      this.controlState.left = true;
    } else if (angleDiff < -0.3) {
      this.controlState.endNodeLink = true;
      this.controlState.right = true;
    } else {
      if (desiredVelocity.toPolar().r < 100) {
        this.controlState.beginNodeLink = true;
      }
      this.controlState.up = true;
    }

  }

  turn(d) {
    this.angularVelocity = d * this.turnspeed;
  }

  setPower(power) {
    this.power = power;
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
      this.setPower(this.boostAcceleration)
    }
    else {
      this.setPower(this.defaultAcceleration)
    }

    if (this.controlState.beginNodeLink && !this.nodeLinkWaiting && !this.controlState.endNodeLink) {
      this.dropNode();
    }

    if (this.controlState.endNodeLink && this.nodeLinkWaiting) {
      this.dropNode();
    } else {
      this.controlState.endNodeLink = false;
    }

    if (this.controlState.shoot && this.canFire > 0) {
      this.shootBullet();
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

  shootBullet() {
    console.log(this.canFire);
    const newBullet = new Bullet(this);
    this.addGameObject(newBullet);
    this.canFire = -this.fireRate;
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
      this.canvasSize.x / 2 - this.collision.pos.x,
      this.canvasSize.y / 2 - this.collision.pos.y);
  }

  Tick(ev) {
    this.controls()

    applyAngularVelocity(this, ev.delta);
    this.graphics.rotation = radToDeg(this.rotation);


    // drag ~ velocity squared
    const y = this.collision.pos.y;
    const interfaceY = 10;
    const airDragCoefficient = 0.002
    const waterDragCoefficient = 0.008;
    const dragCoefficient =
      y <= -interfaceY ?
        airDragCoefficient :
        y <= interfaceY ?
          airDragCoefficient + ((y + interfaceY) / (2 * interfaceY)) * waterDragCoefficient :
          airDragCoefficient + waterDragCoefficient;

    const dragMagnitude = -(this.velocity.toPolar().r ** 2 * dragCoefficient)
    const drag = this.velocity.unit().scalarMult(dragMagnitude);

    // Decrease power with increasing altitude
    const powerDecay = 0.002;
    const totalPower = this.power *
      (1 - Math.tanh(powerDecay * Math.abs(this.collision.pos.y)));
    this.acceleration = Vector.fromPolar(
      totalPower,
      this.rotation,
    ).add(drag);

    this.canFire += ev.delta;
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
    radius: 20,
  }
}
