import {
  Background,
  Camera,
  Controller,
  ControllerKeysEnum,
  Pokemon,
} from "../core";
import { Utils } from "../core/Utils";
import { GamePosition } from "../types/game";
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

    this.#handlePokemonAttack();
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

  #handlePokemonAttack() {
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.#pokemon.freeze = true;
      const lookDirection = Utils.getPointerDirectionInRelationTo(
        {
          x: pointer.worldX,
          y: pointer.worldY,
        },
        {
          x: this.#pokemon.gameObject.x,
          y: this.#pokemon.gameObject.y,
        }
      );

      let attackPosition: GamePosition;
      switch (lookDirection) {
        case ControllerKeysEnum.W:
          attackPosition = {
            x: this.#pokemon.gameObject.x,
            y:
              this.#pokemon.gameObject.y - this.#pokemon.gameObject.body.height,
          };
          break;
        case ControllerKeysEnum.D:
          attackPosition = {
            x: this.#pokemon.gameObject.x + this.#pokemon.gameObject.body.width,
            y: this.#pokemon.gameObject.y,
          };
          break;
        case ControllerKeysEnum.A:
          attackPosition = {
            x: this.#pokemon.gameObject.x - this.#pokemon.gameObject.body.width,
            y: this.#pokemon.gameObject.y,
          };
          break;
        case ControllerKeysEnum.S:
          attackPosition = {
            x: this.#pokemon.gameObject.x,
            y:
              this.#pokemon.gameObject.y + this.#pokemon.gameObject.body.height,
          };
          break;
      }

      this.#pokemon.primaryAttack(attackPosition, (_sprite) => {
        this.#pokemon.freeze = false;
      });
    });
  }
}
