import { Controller } from "../classes/Controller";
import { Pokemon } from "../classes/Pokemon";
import { SceneEnums, AssetsEnums } from "../types/keys";

export class BattleScene extends Phaser.Scene {
  #pokemon!: Pokemon;
  #controler!: Controller;
  #background!: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: SceneEnums.BATTLE,
      active: false,
    });
  }

  create() {
    this.#controler = new Controller({ scene: this });
    this.#background = this.add.image(0, 0, "map").setOrigin(0);
    this.#pokemon = new Pokemon({
      scene: this,
      gameObjectConfig: {
        x: 0,
        y: 0,
        assetKey: AssetsEnums.BAYLEEF,
        assetFrame: 7,
      },
    });
  }

  update() {
    this.#pokemon.movePlayer(this.#controler.getMovement(), {
      x: this.input.mousePointer.worldX,
      y: this.input.mousePointer.worldY,
    });
  }
}
