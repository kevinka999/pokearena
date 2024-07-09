import {
  Background,
  Camera,
  Controller,
  DirectionsEnum,
  Pokemon,
} from "../core";
import { Bayleef } from "../pokemons/Bayleef";
import { GamePosition } from "../types/game";
import { SceneKeysEnums } from "../types/keys";
import { getPointerDirectionInRelationTo } from "../utils";

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
    // this.#background.turnOnDebugMode();

    this.#handlePokemonAttack();
  }

  update() {
    const pointer = {
      x: this.input.mousePointer.worldX,
      y: this.input.mousePointer.worldY,
    };
    const movements = this.#controller.getMovement();
    this.#pokemon.movePlayer(movements, pointer);
    this.#camera.handleMovingFollowOffset(movements);
  }

  #handlePokemonAttack() {
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const lookDirection = getPointerDirectionInRelationTo(
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
        case DirectionsEnum.UP:
          attackPosition = {
            x: this.#pokemon.gameObject.x,
            y: this.#pokemon.gameObject.y - 16,
          };
          break;
        case DirectionsEnum.RIGHT:
          attackPosition = {
            x: this.#pokemon.gameObject.x + 16,
            y: this.#pokemon.gameObject.y,
          };
          break;
        case DirectionsEnum.LEFT:
          attackPosition = {
            x: this.#pokemon.gameObject.x - 16,
            y: this.#pokemon.gameObject.y,
          };
          break;
        case DirectionsEnum.DOWN:
          attackPosition = {
            x: this.#pokemon.gameObject.x,
            y: this.#pokemon.gameObject.y + 16,
          };
          break;
      }

      this.#pokemon.primaryAttack(attackPosition);
    });
  }
}
