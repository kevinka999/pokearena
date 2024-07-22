import { Scratch } from "../attacks/Scratch";
import { Pokemon } from "../core";
import { PlayerPokemonParams, PokemonTypes } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Mudkip extends Pokemon {
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
          ATTACK: 70,
          DEFENSE: 50,
          SP_ATTACK: 50,
          SP_DEFENSE: 50,
          SPEED: 50,
        },
        type: [PokemonTypes.WATER],
      },
      {
        scene: scene,
        gameObjectConfig: {
          position: { x: 0, y: 0 },
          hitbox: [16, 16],
          hitboxOffset: [8, 14],
          assetKey: PokemonKeysEnums.MUDKIP,
          assetFrame: 7,
          origin: [0.5, 0.5],
        },
      }
    );
  }
}
