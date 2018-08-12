class Node {
  constructor(position, parent) {
    this.onTick = () => { };
    this.graphics = setNodeGraphics("Green");
    this.collision = {
      type: "NONE",
      pos: position
    }
    this.onCollisionWith = () => { };

    this.acceleration = new Vector(0, 0)
    this.rotation = 0 // radians, 0 towards the right, grows counterclockwise
    this.angularVelocity = 0;

    this.gravity = false;
    this.velocity = new Vector(0, 0);
    this.turnspeed = 3;
  }
}

function setNodeGraphics(color) {
  const nodeGraphics = new createjs.Shape();
  nodeGraphics.graphics.beginFill(color)
    .beginStroke('#000000')
    .drawCircle(0, 0, 10);
  return nodeGraphics;
}