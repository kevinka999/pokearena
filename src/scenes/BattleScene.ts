import { Camera } from "../classes/Camera";
import { Controller } from "../classes/Controller";
import { Pokemon } from "../classes/Pokemon";
import { SceneEnums, AssetsEnums } from "../types/keys";

export class BattleScene extends Phaser.Scene {
  #pokemon!: Pokemon;
  #controler!: Controller;
  #camera!: Camera;
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

    this.physics.world.setBounds(
      0,
      0,
      this.#background.displayWidth,
      this.#background.displayHeight
    );
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
