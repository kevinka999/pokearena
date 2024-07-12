import { RazorLeaf } from "../attacks/RazorLeaf";
import { Pokemon, PokemonIvs, PokemonTypes } from "../core";
import { PokemonKeysEnums } from "../types/keys";

type Params = {
  scene: Phaser.Scene;
  level: number;
  ivs?: PokemonIvs;
};

export class Piplup extends Pokemon {
  constructor({ scene, ...pokemon }: Params) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: RazorLeaf,
          secondary: RazorLeaf,
        },
        baseStatus: {
          HP: 53,
          ATTACK: 51,
          DEFENSE: 53,
          SP_ATTACK: 61,
          SP_DEFENSE: 56,
          SPEED: 40,
        },
        type: [PokemonTypes.WATER],
      },
      {
        scene: scene,
        gameObjectConfig: {
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.PIPLUP,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
