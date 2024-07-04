export enum DirectionsEnum {
  UP = "UP",
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  DOWN = "DOWN",
  NONE = "NONE",
}

type ControllerParams = {
  scene: Phaser.Scene;
};

type Controllers = {
  w: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
};

export class Controller {
  scene: Phaser.Scene;
  controller: Controllers;

  constructor(params: ControllerParams) {
    this.scene = params.scene;
    this.controller = this.scene.input.keyboard?.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Controllers;
  }

  getMovement(): DirectionsEnum[] {
    let directionsPressed: DirectionsEnum[] = [];

    if (this.controller.a.isDown) directionsPressed.push(DirectionsEnum.LEFT);
    if (this.controller.d.isDown) directionsPressed.push(DirectionsEnum.RIGHT);
    if (this.controller.w.isDown) directionsPressed.push(DirectionsEnum.UP);
    if (this.controller.s.isDown) directionsPressed.push(DirectionsEnum.DOWN);

    return directionsPressed.length > 0
      ? directionsPressed
      : [DirectionsEnum.NONE];
  }
}
