import { RazorLeaf } from "../attacks/RazorLeaf";
import { Pokemon, PokemonTypes } from "../core";
import { PlayerPokemonParams } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Chimchar extends Pokemon {
  constructor({ scene, ...pokemon }: PlayerPokemonParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: RazorLeaf,
          secondary: RazorLeaf,
        },
        baseStatus: {
          HP: 44,
          ATTACK: 58,
          DEFENSE: 44,
          SP_ATTACK: 58,
          SP_DEFENSE: 44,
          SPEED: 61,
        },
        type: [PokemonTypes.FIRE],
      },
      {
        scene: scene,
        gameObjectConfig: {
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.CHIMCHAR,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
