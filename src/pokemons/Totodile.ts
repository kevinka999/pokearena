import { Scratch } from "../attacks/Scratch";
import { Pokemon } from "../core";
import { PlayerPokemonParams, PokemonTypes } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Totodile extends Pokemon {
  constructor({ scene, ...pokemon }: PlayerPokemonParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: Scratch,
          secondary: Scratch,
        },
        ivs: {
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
          position: { x: 0, y: 0 },
          hitbox: [16, 16],
          hitboxOffset: [8, 14],
          assetKey: PokemonKeysEnums.TOTODILE,
          assetFrame: 7,
          origin: [0.5, 0.5],
        },
      }
    );
  }
}
