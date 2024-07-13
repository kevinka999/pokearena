import { Scratch } from "../attacks/Scratch";
import { Pokemon, PokemonTypes } from "../core";
import { PlayerPokemonParams } from "../types/game";
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
        baseStatus: {
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
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.TURTWIG,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
