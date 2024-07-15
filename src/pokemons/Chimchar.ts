import { Scratch } from "../attacks/Scratch";
import { Pokemon, PokemonTypes } from "../core";
import { PlayerPokemonParams } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Chimchar extends Pokemon {
  constructor({ scene, ...pokemon }: PlayerPokemonParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: Scratch,
          secondary: Scratch,
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
          position: { x: 0, y: 0 },
          hitbox: [16, 16],
          hitboxOffset: [8, 14],
          assetKey: PokemonKeysEnums.CHIMCHAR,
          assetFrame: 7,
          origin: [0.5, 0.5],
        },
      }
    );
  }
}
