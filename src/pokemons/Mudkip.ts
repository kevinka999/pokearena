import { RazorLeaf } from "../attacks/RazorLeaf";
import { Pokemon, PokemonIvs, PokemonTypes } from "../core";
import { PokemonKeysEnums } from "../types/keys";

type Params = {
  scene: Phaser.Scene;
  level: number;
  ivs?: PokemonIvs;
};

export class Mudkip extends Pokemon {
  constructor({ scene, ...pokemon }: Params) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: RazorLeaf,
          secondary: RazorLeaf,
        },
        baseStatus: {
          HP: 50,
          ATTACK: 70,
          DEFENSE: 50,
          SP_ATTACK: 50,
          SP_DEFENSE: 50,
          SPEED: 50,
        },
        type: [PokemonTypes.WATER],
      },
      {
        scene: scene,
        gameObjectConfig: {
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.MUDKIP,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
