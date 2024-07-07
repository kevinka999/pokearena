import { MapKeysEnums } from "../types/keys";

export type BridgeBackgroundParams = {
  scene: Phaser.Scene;
};

export class BridgeBackground {
  #scene: Phaser.Scene;
  #background!: Phaser.GameObjects.Image;

  constructor(params: BridgeBackgroundParams) {
    this.#scene = params.scene;
    this.#background = this.#scene.add
      .image(0, 0, MapKeysEnums.BRIDGE_FULLMAP)
      .setOrigin(0);
  }

  get displayWidth() {
    return this.#background.displayWidth;
  }

  get displayHeight() {
    return this.#background.displayHeight;
  }
}
