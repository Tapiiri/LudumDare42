class Line {
  constructor(node1, node2, parent) {
    this.onTick = () => { };
    const position = node1.collision.pos;
    const rotation = node2.collision.pos.substract(node1.collision.pos).toPolar().phi;
    const length = node2.collision.pos.substract(node1.collision.pos).toPolar().r;

    this.graphics = setLineGraphics("Green", node1, node2);
    this.graphics.x = position.x;
    this.graphics.y = position.y;

    this.collision = {
      type: "LINE",
      pos: position,
      length: length,
      rotation: rotation
    }
    this.onCollisionWith = (that, self) => console.log('Line collision!');

    this.acceleration = new Vector(0, 0)
    this.rotation = 0 // radians, 0 towards the right, grows counterclockwise
    this.angularVelocity = 0;

    this.gravity = false;
    this.velocity = new Vector(0, 0);
    this.turnspeed = 3;
  }
}

function setLineGraphics(color, node1, node2) {
  startX = node1.collision.pos.x;
  startY = node1.collision.pos.y;
  endX = node2.collision.pos.x;
  endY = node2.collision.pos.y;
  const lineGraphics = new createjs.Shape();
  lineGraphics.graphics
    .beginStroke(color)
    .mt(0, 0)
    .lt(endX - startX, endY - startY);
  return lineGraphics;
}