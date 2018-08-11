function init() {
  const stageCanvas = document.getElementById('demoCanvas');
  stageCanvas.width = $(window).width();
  stageCanvas.height = $(window).height();
  let stage = new createjs.Stage('demoCanvas');
  stage.w;
  let player = new createjs.Shape();
  player.graphics.beginFill('Red').drawRect(0, 0, 100, 100);
  player.x = 100;
  player.y = 100;
  stage.addChild(player);
  createjs.Ticker.addEventListener('tick', onTick);
  function onTick(ev) {
    player.x += 5 * Math.sin(0.005 * ev.time);
    stage.update();
  }

  stage.add;
}
