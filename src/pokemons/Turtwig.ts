import { Scratch } from "../attacks/Scratch";
import { Pokemon } from "../core";
import { PlayerPokemonParams, PokemonTypes } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Turtwig extends Pokemon {
  constructor({ scene, ...pokemon }: PlayerPokemonParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: Scratch,
          secondary: Scratch,
        },
        ivs: {
          HP: 55,
          ATTACK: 68,
          DEFENSE: 64,
          SP_ATTACK: 45,
          SP_DEFENSE: 55,
          SPEED: 31,
        },
        type: [PokemonTypes.GRASS],
      },
      {
        scene: scene,
        gameObjectConfig: {
          position: { x: 0, y: 0 },
          hitbox: [16, 16],
          hitboxOffset: [8, 14],
          assetKey: PokemonKeysEnums.TURTWIG,
          assetFrame: 7,
          origin: [0.5, 0.5],
        },
      }
    );
  }
}
