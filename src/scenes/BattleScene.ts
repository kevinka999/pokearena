import { Background, Camera, Controller, Pokemon } from "../core";
import { SceneKeysEnums } from "../types/keys";

export class BattleScene extends Phaser.Scene {
  #pokemon!: Pokemon;
  #controller!: Controller;
  #camera!: Camera;
  #background!: Background;

  constructor() {
    super({
      key: SceneKeysEnums.BATTLE,
      active: false,
    });
  }

  create() {
    this.#controller = new Controller({ scene: this });
    this.#background = new Background({ scene: this });
    const PlayerPokemon = this.global.getSelectedPokemonClass();
    this.#pokemon = new PlayerPokemon({
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
    const keysPressed = this.#controller.getKeysPressed();
    this.#pokemon.movePlayer(keysPressed, pointer);
    this.#camera.handleMovingFollowOffset(keysPressed);
  }
}
