import { Scratch } from "../attacks/Scratch";
import { Pokemon } from "../core";
import { PlayerPokemonParams, PokemonTypes } from "../types/game";
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
          position: { x: 0, y: 0 },
          hitbox: [16, 16],
          hitboxOffset: [8, 14],
          assetKey: PokemonKeysEnums.CYNDAQUIL,
          assetFrame: 7,
          origin: [0.5, 0.5],
        },
      }
    );
  }
}
