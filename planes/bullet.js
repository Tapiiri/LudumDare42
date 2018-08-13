class Bullet {
  constructor(parent) {

    this.parent = parent;
    this.removeGameObject = parent.removeGameObject;
    this.addGameObject = parent.addGameObject;

    this.onTick = (ev) => {
      this.addGameObject(new BulletGraphic(this));
      this.lastPos = this.collision.pos
      this.createdAt += ev.delta;
      if (this.createdAt >= this.lifeSpan) {
        this.removeGameObject(this)
      }
    };
    this.graphics = new createjs.Shape();
    //this.graphics.cache(-10, -10, 20, 20);

    this.collision = {
      type: "CIRCLE",
      pos: parent.collision.pos,
      radius: 10,
      damage: 20
    }
    this.lastPos = this.collision.pos
    this.onCollisionWith = () => { console.log("Bullet collision!") };

    this.acceleration = new Vector(0, 0)
    this.rotation = 0
    this.angularVelocity = 0;

    this.lifeSpan = 1000; //ms
    this.createdAt = 0;

    this.gravity = true;
    this.velocity = Vector.fromPolar(1000, parent.rotation).add(parent.velocity);
    this.turnspeed = 3;
  }
}

class BulletGraphic {
  constructor(parent) {

    this.parent = parent;

    this.onTick = (ev) => {
      this.createdAt += ev.delta;
      if (this.createdAt >= this.lifeSpan) {
        parent.removeGameObject(this)
      }
    };
    this.graphics = setBulletGraphics( parent.lastPos.substract(parent.collision.pos) );

    this.collision = {
      type: "None",
      pos: parent.collision.pos
    }

    this.rotation = parent.rotation

    this.lifeSpan = 100; //ms
    this.createdAt = 0;
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0)
    this.gravity = false;
  }
}

function setBulletGraphics(to) {
  const bulletGraphics = new createjs.Shape();
  bulletGraphics.graphics
    .beginStroke('#FFFF00')
    .setStrokeStyle(4)
    .moveTo(0,0)
    .lineTo(to.x,to.y);
  return bulletGraphics;
}