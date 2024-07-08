import { Attack, AttackBaseParams } from "./Attack";
import { DirectionsEnum } from "./Controller";
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
  ivs: PokemonIvs;
  type: [PokemonTypes];
  moveset: Moveset;
};

export class Pokemon extends Player {
  #scene: Phaser.Scene;
  #level!: number;
  #ivs!: PokemonIvs;
  #type!: [PokemonTypes];
  #moveset!: Moveset;
  #projectiles: any;

  constructor(
    pokemonParams: PokemonBaseParams,
    playerParams: Omit<PlayerParams, "idleFrameConfig">
  ) {
    super({
      ...playerParams,
      idleFrameConfig: {
        [DirectionsEnum.DOWN]: 4,
        [DirectionsEnum.UP]: 0,
        [DirectionsEnum.LEFT]: 1,
        [DirectionsEnum.RIGHT]: 5,
      },
    });

    this.#scene = playerParams.scene;
    this.#level = pokemonParams.level;
    this.#ivs = pokemonParams.ivs;
    this.#type = pokemonParams.type;
    this.#moveset = pokemonParams.moveset;
  }

  primaryAttack() {
    const attack = new this.#moveset.primary({
      scene: this.#scene,
      gameObject: this.gameObject,
    });
  }
}
