import { Scratch } from "../attacks/Scratch";
import { Pokemon, PokemonTypes } from "../core";
import { PlayerPokemonParams } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Squirtle extends Pokemon {
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
          ATTACK: 48,
          DEFENSE: 65,
          SP_ATTACK: 50,
          SP_DEFENSE: 64,
          SPEED: 43,
        },
        type: [PokemonTypes.WATER],
      },
      {
        scene: scene,
        gameObjectConfig: {
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.SQUIRTLE,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
