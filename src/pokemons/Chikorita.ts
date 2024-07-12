import { RazorLeaf } from "../attacks/RazorLeaf";
import { Pokemon, PokemonIvs, PokemonTypes } from "../core";
import { PokemonKeysEnums } from "../types/keys";

type Params = {
  scene: Phaser.Scene;
  level: number;
  ivs?: PokemonIvs;
};

export class Chikorita extends Pokemon {
  constructor({ scene, ...pokemon }: Params) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: RazorLeaf,
          secondary: RazorLeaf,
        },
        baseStatus: {
          HP: 45,
          ATTACK: 49,
          DEFENSE: 65,
          SP_ATTACK: 49,
          SP_DEFENSE: 65,
          SPEED: 45,
        },
        type: [PokemonTypes.GRASS],
      },
      {
        scene: scene,
        gameObjectConfig: {
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.CHIKORITA,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
