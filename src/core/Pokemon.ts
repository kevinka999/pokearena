import { DirectionsEnum } from "./Controller";
import { Player, PlayerParams } from "./Player";

enum PokemonTypes {
  water = "water",
  fire = "fire",
  grass = "grass",
}

enum MovesEnum {
  ember = "ember",
  waterGun = "water_gun",
  razorLeaf = "razor_leaf",
}

type MovesInfo = {
  name: string;
  damage: number;
  type: PokemonTypes;
};

type Status = {
  hp: number;
  attack: number;
  spAttack: number;
  defense: number;
  spDefense: number;
  speed: number;
};

export type PokemonParams = {
  level?: number;
  status?: Status;
  type?: PokemonTypes;
  moves?: [MovesInfo];
} & Omit<PlayerParams, "idleFrameConfig">;

export const PokemonMoves: { [key in MovesEnum]: MovesInfo } = Object.freeze({
  [MovesEnum.ember]: {
    name: "Ember",
    damage: 40,
    type: PokemonTypes.fire,
  },
  [MovesEnum.waterGun]: {
    name: "Water gun",
    damage: 40,
    type: PokemonTypes.water,
  },
  [MovesEnum.razorLeaf]: {
    name: "Razor leaf",
    damage: 40,
    type: PokemonTypes.grass,
  },
});

export class Pokemon extends Player {
  #level?: number;
  #stats?: Status;
  #type?: PokemonTypes;
  #movesAvailable?: MovesInfo[];

  constructor(params: PokemonParams) {
    super({
      scene: params.scene,
      gameObjectConfig: params.gameObjectConfig,
      idleFrameConfig: {
        [DirectionsEnum.DOWN]: 4,
        [DirectionsEnum.UP]: 0,
        [DirectionsEnum.LEFT]: 1,
        [DirectionsEnum.RIGHT]: 5,
      },
    });

    this.#level = params.level;
    this.#stats = params.status;
    this.#type = params.type;
    this.#movesAvailable = params.moves;
  }
}
