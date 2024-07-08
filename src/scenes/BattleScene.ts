import { Background, Camera, Controller, Pokemon } from "../core";
import { Bayleef } from "../pokemons/Bayleef";
import { SceneKeysEnums, PokemonKeysEnums } from "../types/keys";

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
    this.#pokemon = new Bayleef({
      scene: this,
      level: 100,
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

    this.#background.setSpawnPoint(this.#pokemon.gameObject);
    this.#background.addCollider(this.#pokemon.gameObject);
    this.#background.turnOnDebugMode();
  }

  update() {
    const pointer = {
      x: this.input.mousePointer.worldX,
      y: this.input.mousePointer.worldY,
    };
    const movements = this.#controler.getMovement();
    this.#pokemon.movePlayer(movements, pointer);
    this.#camera.handleMovingFollowOffset(movements);

    const attack = this.#controler.pressedPrimaryAttack();
    if (attack) {
      this.#pokemon.primaryAttack();
    }
  }
}
