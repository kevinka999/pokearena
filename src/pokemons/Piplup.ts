import { Scratch } from "../attacks/Scratch";
import { Pokemon } from "../core";
import { PlayerPokemonParams, PokemonTypes } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Piplup extends Pokemon {
  constructor({ scene, ...pokemon }: PlayerPokemonParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: Scratch,
          secondary: Scratch,
        },
        baseStatus: {
          HP: 53,
          ATTACK: 51,
          DEFENSE: 53,
          SP_ATTACK: 61,
          SP_DEFENSE: 56,
          SPEED: 40,
        },
        type: [PokemonTypes.WATER],
      },
      {
        scene: scene,
        gameObjectConfig: {
          position: { x: 0, y: 0 },
          hitbox: [16, 16],
          hitboxOffset: [8, 14],
          assetKey: PokemonKeysEnums.PIPLUP,
          assetFrame: 7,
          origin: [0.5, 0.5],
        },
      }
    );
  }
}
