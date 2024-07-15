import { GamePosition, IPokemonAttack } from "../types/game";
import { ControllerKeysEnum } from "./Controller";
import { Player, PlayerParams } from "./Player";
import { Utils } from "./Utils";

export enum PokemonTypes {
  WATER = "water",
  FIRE = "fire",
  GRASS = "grass",
}

export type PokemonIvs = {
  HP: number;
  ATTACK: number;
  SP_ATTACK: number;
  DEFENSE: number;
  SP_DEFENSE: number;
  SPEED: number;
};

type Moveset = {
  primary: IPokemonAttack;
  secondary: IPokemonAttack;
};

export type PokemonBaseParams = {
  level: number;
  baseStatus: PokemonIvs;
  type: [PokemonTypes];
  moveset: Moveset;
};

export class Pokemon extends Player {
  #scene: Phaser.Scene;
  #level!: number;
  #baseStatus!: PokemonIvs;
  #type!: [PokemonTypes];
  #moveset!: Moveset;
  #attacks: Phaser.Physics.Arcade.StaticGroup;

  constructor(
    pokemonParams: PokemonBaseParams,
    playerParams: Omit<PlayerParams, "idleFrameConfig">
  ) {
    super({
      ...playerParams,
      idleFrameConfig: {
        [ControllerKeysEnum.S]: 4,
        [ControllerKeysEnum.W]: 0,
        [ControllerKeysEnum.A]: 1,
        [ControllerKeysEnum.D]: 5,
      },
    });

    this.#scene = playerParams.scene;
    this.#level = pokemonParams.level;
    this.#baseStatus = pokemonParams.baseStatus;
    this.#type = pokemonParams.type;
    this.#moveset = pokemonParams.moveset;
    this.#attacks = this.#scene.physics.add.staticGroup();

    this.#handlePokemonPrimaryAttack();
  }

  #createPrimaryAttack(
    position: GamePosition,
    callback?: (sprite: Phaser.Physics.Arcade.Sprite) => void
  ) {
    if (this.#attacks?.getLength() > 0) return;

    const attack = new this.#moveset.primary({
      scene: this.#scene,
      position,
      direction: this.lookDirection,
      callback,
    });

    this.#attacks.add(attack);
  }

  #handlePokemonPrimaryAttack() {
    this.#scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.freeze = true;
      const lookDirection = Utils.getPointerDirectionInRelationTo(
        {
          x: pointer.worldX,
          y: pointer.worldY,
        },
        {
          x: this.gameObject.x,
          y: this.gameObject.y,
        }
      );

      let attackPosition: GamePosition = {
        x: this.gameObject.body.x + this.gameObject.body.width / 2,
        y: this.gameObject.body.y + this.gameObject.body.height / 2,
      };

      switch (lookDirection) {
        case ControllerKeysEnum.W:
          attackPosition.y -= this.gameObject.body.height;
          break;
        case ControllerKeysEnum.D:
          attackPosition.x += this.gameObject.body.width;
          break;
        case ControllerKeysEnum.A:
          attackPosition.x -= this.gameObject.body.width;
          break;
        case ControllerKeysEnum.S:
          attackPosition.y += this.gameObject.body.height;
          break;
      }

      this.#createPrimaryAttack(attackPosition, (_sprite) => {
        this.freeze = false;
      });
    });
  }
}
