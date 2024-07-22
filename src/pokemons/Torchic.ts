import { Scratch } from "../attacks/Scratch";
import { Pokemon } from "../core";
import { PlayerPokemonParams, PokemonTypes } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

export class Torchic extends Pokemon {
  constructor({ scene, ...pokemon }: PlayerPokemonParams) {
    super(
      {
        ...pokemon,
        moveset: {
          primary: Scratch,
          secondary: Scratch,
        },
        ivs: {
          HP: 45,
          ATTACK: 60,
          DEFENSE: 40,
          SP_ATTACK: 70,
          SP_DEFENSE: 50,
          SPEED: 45,
        },
        type: [PokemonTypes.FIRE],
      },
      {
        scene: scene,
        gameObjectConfig: {
          position: { x: 0, y: 0 },
          hitbox: [16, 16],
          hitboxOffset: [8, 14],
          assetKey: PokemonKeysEnums.TORCHIC,
          assetFrame: 7,
          origin: [0.5, 0.5],
        },
      }
    );
  }
}
