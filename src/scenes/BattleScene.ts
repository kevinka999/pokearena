import { Background, Camera, Controller, Pokemon } from "../core";
import { SceneKeysEnums, AssetsKeysEnums } from "../types/keys";

export class BattleScene extends Phaser.Scene {
  #pokemon!: Pokemon;
  #controler!: Controller;
  #camera!: Camera;
  #background!: Background;

  constructor() {
    super({
      key: SceneKeysEnums.BATTLE,
      active: false,
    });
  }

  create() {
    this.#controler = new Controller({ scene: this });
    this.#background = new Background({ scene: this });
    this.#pokemon = new Pokemon({
      scene: this,
      gameObjectConfig: {
        x: 0,
        y: 0,
        assetKey: AssetsKeysEnums.BAYLEEF,
        assetFrame: 7,
        origin: { x: 0.5, y: 0.5 },
      },
    });
    this.#camera = new Camera({
      scene: this,
      followObject: this.#pokemon.gameObject,
      bounds: [
        0,
        0,
        this.#background.displayWidth,
        this.#background.displayHeight,
      ],
    });

    this.#background.addCollider(this.#pokemon.gameObject);
  }

  update() {
    const pointer = {
      x: this.input.mousePointer.worldX,
      y: this.input.mousePointer.worldY,
    };
    const movements = this.#controler.getMovement();
    this.#pokemon.movePlayer(movements, pointer);
    this.#camera.handleMovingFollowOffset(movements);
  }
}
