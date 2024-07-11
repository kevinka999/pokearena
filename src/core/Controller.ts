export enum ControllerKeysEnum {
  W = "W",
  D = "D",
  A = "A",
  S = "S",
  SPACE = "SPACE",
}

type ControllerParams = {
  scene: Phaser.Scene;
};

type Controllers = {
  [key in ControllerKeysEnum]: Phaser.Input.Keyboard.Key;
};

export class Controller {
  #scene: Phaser.Scene;
  #controller: Controllers;

  constructor(params: ControllerParams) {
    this.#scene = params.scene;
    this.#controller = this.#scene.input.keyboard?.addKeys({
      [ControllerKeysEnum.W]: Phaser.Input.Keyboard.KeyCodes.W,
      [ControllerKeysEnum.S]: Phaser.Input.Keyboard.KeyCodes.S,
      [ControllerKeysEnum.A]: Phaser.Input.Keyboard.KeyCodes.A,
      [ControllerKeysEnum.D]: Phaser.Input.Keyboard.KeyCodes.D,
      [ControllerKeysEnum.SPACE]: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as Controllers;
  }

  getKeysPressed(): ControllerKeysEnum[] {
    let keysPressed: ControllerKeysEnum[] = [];

    if (this.#controller.A.isDown) keysPressed.push(ControllerKeysEnum.A);
    if (this.#controller.D.isDown) keysPressed.push(ControllerKeysEnum.D);
    if (this.#controller.W.isDown) keysPressed.push(ControllerKeysEnum.W);
    if (this.#controller.S.isDown) keysPressed.push(ControllerKeysEnum.S);
    if (this.#controller.SPACE.isDown)
      keysPressed.push(ControllerKeysEnum.SPACE);

    return keysPressed;
  }
}
