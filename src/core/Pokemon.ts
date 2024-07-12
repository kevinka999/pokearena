import { GamePosition } from "../types/game";
import { Attack, AttackBaseParams } from "./Attack";
import { ControllerKeysEnum } from "./Controller";
import { Player, PlayerParams } from "./Player";

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
  primary: new (params: AttackBaseParams) => Attack;
  secondary: new (params: AttackBaseParams) => Attack;
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
  }

  primaryAttack(
    position: GamePosition,
    callback?: (sprite: Phaser.Physics.Arcade.Sprite) => void
  ) {
    if (this.#attacks?.getLength() > 0) return;

    const attack = new this.#moveset.primary({
      scene: this.#scene,
      x: position.x,
      y: position.y,
      callback,
    });

    this.#attacks.add(attack);
  }
}
