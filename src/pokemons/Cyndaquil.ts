import { Scratch } from "../attacks/Scratch";
import { Pokemon, PokemonTypes } from "../core";
import { PlayerPokemonParams } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Cyndaquil extends Pokemon {
  constructor({ scene, ...pokemon }: PlayerPokemonParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: Scratch,
          secondary: Scratch,
        },
        baseStatus: {
          HP: 39,
          ATTACK: 52,
          DEFENSE: 43,
          SP_ATTACK: 60,
          SP_DEFENSE: 50,
          SPEED: 65,
        },
        type: [PokemonTypes.FIRE],
      },
      {
        scene: scene,
        gameObjectConfig: {
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.CYNDAQUIL,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
