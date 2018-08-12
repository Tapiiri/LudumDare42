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
        player.turn( 1);
        break
      case 'ArrowRight':
        player.turn(-1);
        break;
      case 'ArrowUp':
        player.accelerate(player.boostAcceleration)
        break;
    }
  });
  document.addEventListener('keyup', (ev) => {
    switch (ev.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        player.turn( 0 );
        break;
      case 'ArrowUp':
        player.accelerate(player.defaultAcceleration)
        break;
    }
  });

}