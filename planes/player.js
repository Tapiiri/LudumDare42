const playerGraphics = new createjs.Shape();
playerGraphics.graphics
  .beginFill('Green')
  .beginStroke('#000000')
  .mt(0, -70)
  .lt(50, 30)
  .lt(-50, 30)
  .lt(0, -70)
  .beginFill('Red')
  .drawCircle(0, 0, 10);