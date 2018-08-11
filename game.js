function init() {
  let stage = new createjs.Stage('demoCanvas');
  /* gameObject contains:
   *   graphics - EaselJS DisplayObject
   *   onTick - function (tick event, this gameObject)
   *   gravity - Boolean whether to apply gravity
   *   hitbox - ???
   */
  const gameObjects = [];
  function addGameObject(go) {
    stage.addChild(go.graphics);
    gameObjects.push(go);
  }

  const playerGraphics = new createjs.Shape();
  playerGraphics.graphics.beginFill('Red').drawRect(0, 0, 100, 100);
  playerGraphics.x = 100;
  playerGraphics.y = 100;
  const player = {
    graphics: playerGraphics,
    onTick: (ev, self) => self.graphics.x += 5 * Math.sin(0.005 * ev.time),
    gravity: true,
  };
  addGameObject(player);

  createjs.Ticker.addEventListener('tick', onTick);
  function onTick(ev) {
    gameObjects.forEach(go => go.onTick(ev, go));
    stage.update();
  }

  stage.add;
}
