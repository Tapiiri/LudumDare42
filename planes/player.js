function setPlayerShip(ship) {
  const shipGraphics = new createjs.Shape();
  shipGraphics.graphics
  .beginFill('Green')
  .beginStroke('#000000')
  .mt(0, -50)
  .lt(40, 30)
  .lt(-40, 30)
  .lt(0, -50)
  .beginFill('Red')
  .drawCircle(0, 0, 10);

  ship.graphics = shipGraphics;
  ship.collision = {
    type: "CIRCLE",
    radius: 10,
  }

  addControls(ship);
}

function addControls(player) {
  document.addEventListener('keydown', (ev) => {
    switch (ev.key) {
      case 'ArrowLeft':
        player.controlState.left = true;
        break
      case 'ArrowRight':
        player.controlState.right = true;
        break;
      case 'ArrowUp':
        player.controlState.up = true;
        break;
      case ' ':
        player.controlState.beginNodeLink = true;
        break;
    }
  });
  document.addEventListener('keyup', (ev) => {
    switch (ev.key) {
      case 'ArrowLeft':
        player.controlState.left = false;
        break
      case 'ArrowRight':
        player.controlState.right = false;
        break;
      case 'ArrowUp':
        player.controlState.up = false;
        break;
      case ' ':
        player.controlState.endNodeLink = true;
        break;
    }
  });

}

/*
     = {
      collision: {
        type: "CIRCLE",
        collisionRadius: 4,
        pos: new Vector(Math.random() * 300, Math.random() * 300),
      },
      graphics: enemyGraphics,
      onTick: (ev, self) => {
        self.velocity.x += 5 * Math.sin(0.005 * ev.time);
        self.velocity.y += 5 * Math.cos(0.005 * ev.time);
      },
      gravity: false,
      velocity: new Vector(10, 10),
      acceleration: new Vector(0, 0),
    };

        enemyGraphics.graphics
      .beginFill('Violet')
      .beginStroke('#000000')
      .mt(size / 2, 0)
      .lt(size, size)
      .lt(0, size)
      .lt(size / 2, 0)
      .beginFill('Red')
      .drawCircle(0, 0, 4);


*/
