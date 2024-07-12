import { RazorLeaf } from "../attacks/RazorLeaf";
import { Pokemon, PokemonTypes } from "../core";
import { PlayerPokemonParams } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Totodile extends Pokemon {
  constructor({ scene, ...pokemon }: PlayerPokemonParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: RazorLeaf,
          secondary: RazorLeaf,
        },
        baseStatus: {
          HP: 50,
          ATTACK: 65,
          DEFENSE: 64,
          SP_ATTACK: 44,
          SP_DEFENSE: 48,
          SPEED: 43,
        },
        type: [PokemonTypes.WATER],
      },
      {
        scene: scene,
        gameObjectConfig: {
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.TOTODILE,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
