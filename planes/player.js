function addKeyReactions(self) {
  document.addEventListener('keydown', (ev) => {
    switch (ev.key) {
      case 'ArrowLeft':
        self.angularVelocity = angularVelocity;
        break;
      case 'ArrowRight':
        self.angularVelocity = -angularVelocity;
        break;
      case 'ArrowUp':
        self.accelerationMagnitude = boostAcceleration;
        break;
    }
  });
  document.addEventListener('keyup', (ev) => {
    switch (ev.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        self.angularVelocity = 0;
        break;
      case 'ArrowUp':
        self.accelerationMagnitude = defaultAcceleration;
        break;
    }
  });
}