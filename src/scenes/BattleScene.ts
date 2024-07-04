import { Controller } from "../classes/Controller";
import { Pokemon } from "../classes/Pokemon";
import { SceneEnums, AssetsEnums } from "../types/keys";

export class BattleScene extends Phaser.Scene {
  pokemon!: Pokemon;
  controler!: Controller;

  constructor() {
    super({
      key: SceneEnums.BATTLE,
      active: false,
    });
  }

  create() {
    this.pokemon = new Pokemon({
      scene: this,
      gameObjectConfig: {
        x: 0,
        y: 0,
        assetKey: AssetsEnums.BAYLEEF,
        assetFrame: 7,
        origin: 0,
      },
    });

    this.controler = new Controller({ scene: this });
  }

  update() {
    this.pokemon.movePlayer(this.controler.getMovement(), {
      x: this.input.x,
      y: this.input.y,
    });
  }
}
