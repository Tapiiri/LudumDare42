class Bullet {
  constructor(parent) {
    this.onTick = (ev) => {
      this.createdAt += ev.delta;
      if (this.createdAt >= this.lifeSpan) {
        parent.removeGameObject(this)
      }
    };
    this.graphics = setBulletGraphics("Red");
    this.collision = {
      type: "CIRCLE",
      pos: parent.collision.pos,
      radius: 10
    }
    this.onCollisionWith = () => { console.log("Bullet collision!") };

    this.acceleration = new Vector(0, 0)
    this.rotation = 0
    this.angularVelocity = 0;

    this.lifeSpan = 1000; //ms
    this.createdAt = 0;

    this.gravity = true;
    this.velocity = Vector.fromPolar(1000, parent.rotation);
    this.turnspeed = 3;
  }
}

function setBulletGraphics(color) {
  const bulletGraphics = new createjs.Shape();
  bulletGraphics.graphics.beginFill(color)
    .beginStroke('#000000')
    .drawCircle(0, 0, 10);
  return bulletGraphics;
}