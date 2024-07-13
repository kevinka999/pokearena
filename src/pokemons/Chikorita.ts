import { Scratch } from "../attacks/Scratch";
import { Pokemon, PokemonTypes } from "../core";
import { PlayerPokemonParams } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Chikorita extends Pokemon {
  constructor({ scene, ...pokemon }: PlayerPokemonParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: Scratch,
          secondary: Scratch,
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
