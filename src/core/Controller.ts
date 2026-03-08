export enum ControllerKeysEnum {
  W = "W",
  D = "D",
  A = "A",
  S = "S",
  SPACE = "SPACE",
  SHIFT = "SHIFT",
  ARROW_UP = "ARROW_UP",
  ARROW_DOWN = "ARROW_DOWN",
  ARROW_LEFT = "ARROW_LEFT",
  ARROW_RIGHT = "ARROW_RIGHT",
}

type ControllerParams = {
  scene: Phaser.Scene;
};

type Controllers = {
  [key in ControllerKeysEnum]: Phaser.Input.Keyboard.Key;
};

export const movimentationDirections = [
  ControllerKeysEnum.A,
  ControllerKeysEnum.D,
  ControllerKeysEnum.S,
  ControllerKeysEnum.W,
  ControllerKeysEnum.ARROW_LEFT,
  ControllerKeysEnum.ARROW_RIGHT,
  ControllerKeysEnum.ARROW_DOWN,
  ControllerKeysEnum.ARROW_UP,
];

export class Controller {
  #scene: Phaser.Scene;
  #controller: Controllers;
  #doubleTapWindow = 250;
  #lastTapTime: Map<ControllerKeysEnum, number> = new Map();
  #doubleTapDirection?: ControllerKeysEnum;

  constructor(params: ControllerParams) {
    this.#scene = params.scene;
    this.#controller = this.#scene.input.keyboard?.addKeys({
      [ControllerKeysEnum.W]: Phaser.Input.Keyboard.KeyCodes.W,
      [ControllerKeysEnum.S]: Phaser.Input.Keyboard.KeyCodes.S,
      [ControllerKeysEnum.A]: Phaser.Input.Keyboard.KeyCodes.A,
      [ControllerKeysEnum.D]: Phaser.Input.Keyboard.KeyCodes.D,
      [ControllerKeysEnum.SPACE]: Phaser.Input.Keyboard.KeyCodes.SPACE,
      [ControllerKeysEnum.SHIFT]: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      [ControllerKeysEnum.ARROW_UP]: Phaser.Input.Keyboard.KeyCodes.UP,
      [ControllerKeysEnum.ARROW_DOWN]: Phaser.Input.Keyboard.KeyCodes.DOWN,
      [ControllerKeysEnum.ARROW_LEFT]: Phaser.Input.Keyboard.KeyCodes.LEFT,
      [ControllerKeysEnum.ARROW_RIGHT]: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    }) as Controllers;

    movimentationDirections.forEach((direction) => {
      const key = this.#controller[direction];
      key.on("down", () => this.#registerTap(direction));
    });
  }

  getKeysPressed(): ControllerKeysEnum[] {
    let keysPressed: ControllerKeysEnum[] = [];

    if (this.#controller.A.isDown) keysPressed.push(ControllerKeysEnum.A);
    if (this.#controller.D.isDown) keysPressed.push(ControllerKeysEnum.D);
    if (this.#controller.W.isDown) keysPressed.push(ControllerKeysEnum.W);
    if (this.#controller.S.isDown) keysPressed.push(ControllerKeysEnum.S);
    if (this.#controller.SPACE.isDown)
      keysPressed.push(ControllerKeysEnum.SPACE);
    if (this.#controller.SHIFT.isDown)
      keysPressed.push(ControllerKeysEnum.SHIFT);
    if (this.#controller.ARROW_UP.isDown)
      keysPressed.push(ControllerKeysEnum.ARROW_UP);
    if (this.#controller.ARROW_DOWN.isDown)
      keysPressed.push(ControllerKeysEnum.ARROW_DOWN);
    if (this.#controller.ARROW_LEFT.isDown)
      keysPressed.push(ControllerKeysEnum.ARROW_LEFT);
    if (this.#controller.ARROW_RIGHT.isDown)
      keysPressed.push(ControllerKeysEnum.ARROW_RIGHT);

    return keysPressed;
  }

  listenEventKeyboardDown(
    keyboardEvent: ControllerKeysEnum | ControllerKeysEnum[],
    callback: (e: Phaser.Input.Keyboard.Key) => void
  ) {
    if (Array.isArray(keyboardEvent)) {
      keyboardEvent.forEach((keyEvent) => {
        const key = this.#controller[keyEvent];
        key.on("down", callback);
      });
      return;
    }

    const key = this.#controller[keyboardEvent];
    key.on("down", callback);
  }

  consumeDoubleTapDirection() {
    const direction = this.#doubleTapDirection;
    this.#doubleTapDirection = undefined;
    return direction;
  }

  #getTimestamp() {
    if (typeof performance !== "undefined" && performance.now) {
      return performance.now();
    }
    return Date.now();
  }

  #registerTap(direction: ControllerKeysEnum) {
    const now = this.#getTimestamp();
    const previous = this.#lastTapTime.get(direction);
    if (previous && now - previous <= this.#doubleTapWindow) {
      this.#doubleTapDirection = direction;
    }
    this.#lastTapTime.set(direction, now);
  }
}
