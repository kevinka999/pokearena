import { RazorLeaf } from "../attacks/RazorLeaf";
import { Pokemon, PokemonIvs, PokemonTypes } from "../core";
import { PokemonKeysEnums } from "../types/keys";

type Params = {
  scene: Phaser.Scene;
  level: number;
  ivs?: PokemonIvs;
};

export class Treecko extends Pokemon {
  constructor({ scene, ...pokemon }: Params) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: RazorLeaf,
          secondary: RazorLeaf,
        },
        baseStatus: {
          HP: 40,
          ATTACK: 45,
          DEFENSE: 35,
          SP_ATTACK: 65,
          SP_DEFENSE: 55,
          SPEED: 70,
        },
        type: [PokemonTypes.GRASS],
      },
      {
        scene: scene,
        gameObjectConfig: {
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.TREECKO,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
