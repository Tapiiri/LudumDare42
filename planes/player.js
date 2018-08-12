function setPlayerShip(ship){
  const shipGraphics = new createjs.Shape();
  shipGraphics.graphics
  .beginFill('Green')
  .beginStroke('#000000')
  .mt(0, -70)
  .lt(50, 30)
  .lt(-50, 30)
  .lt(0, -70)
  .beginFill('Red')
  .drawCircle(0, 0, 10);

  ship.graphics = shipGraphics;
  ship.collision = {
    type: "CIRCLE",
    collisionRadius: 10,
    pos: position
  }
}

function addControls(player){
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
    }
  });

}