import { RazorLeaf } from "../attacks/RazorLeaf";
import { Pokemon, PokemonIvs, PokemonTypes } from "../core";
import { PokemonKeysEnums } from "../types/keys";

type BayleefParams = {
  scene: Phaser.Scene;
  level: number;
  ivs?: PokemonIvs;
};

export class Bayleef extends Pokemon {
  constructor({ scene, ...pokemon }: BayleefParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: RazorLeaf,
          secondary: RazorLeaf,
        },
        ivs: {
          HP: 255,
          ATTACK: 255,
          DEFENSE: 255,
          SP_ATTACK: 255,
          SP_DEFENSE: 255,
          SPEED: 255,
        },
        type: [PokemonTypes.GRASS],
      },
      {
        scene: scene,
        gameObjectConfig: {
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.BAYLEEF,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
