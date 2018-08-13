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
    const side = Math.abs(parent.rotation) > Math.PI / 2

    this.collision = {
      type: "CIRCLE",
      pos: parent.collision.pos.add(Vector.fromPolar(82, parent.rotation)).add(Vector.fromPolar(side?16:-16, parent.rotation + Math.PI/4)),
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
    this.velocity = Vector.fromPolar(2000, parent.rotation).add(parent.velocity);
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
      else{
        this.color = 100 + 155 * (this.lifeSpan - this.createdAt) / this.lifeSpan;
        this.setBulletGraphics();
      }
    };
    this.width = 4;
    this.color = 255;
    this.from = parent.lastPos;
    this.to = parent.collision.pos;
    this.graphics = new createjs.Shape();
    this.setBulletGraphics();

    this.collision = {
      type: "None",
      pos: new Vector(0, 0)
    }

    this.rotation = parent.rotation

    this.lifeSpan = 100; //ms
    this.createdAt = 0;
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0)
    this.gravity = false;

  }

  setBulletGraphics(){
    this.graphics.graphics
      .beginStroke(`rgba(${this.color}, ${this.color}, 0, 1)`)
      .setStrokeStyle(this.width)
      .moveTo(this.from.x, this.from.y)
      .lineTo(this.to.x, this.to.y);
  }
}
