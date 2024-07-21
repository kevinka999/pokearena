import { Scratch } from "../attacks/Scratch";
import { Pokemon } from "../core";
import { PlayerPokemonParams, PokemonTypes } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Treecko extends Pokemon {
  constructor({ scene, ...pokemon }: PlayerPokemonParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: Scratch,
          secondary: Scratch,
        },
        baseStatus: {
          HP: 40,
          ATTACK: 45,
          DEFENSE: 35,
          SP_ATTACK: 65,
          SP_DEFENSE: 55,
          SPEED: 70,
        },
        type: [PokemonTypes.GRASS],
      },
      {
        scene: scene,
        gameObjectConfig: {
          position: { x: 0, y: 0 },
          hitbox: [16, 16],
          hitboxOffset: [8, 14],
          assetKey: PokemonKeysEnums.TREECKO,
          assetFrame: 7,
          origin: [0.5, 0.5],
        },
      }
    );
  }
}
