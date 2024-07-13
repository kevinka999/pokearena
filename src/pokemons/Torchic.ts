import { Scratch } from "../attacks/Scratch";
import { Pokemon, PokemonTypes } from "../core";
import { PlayerPokemonParams } from "../types/game";
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
        baseStatus: {
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
          x: 0,
          y: 0,
          assetKey: PokemonKeysEnums.TORCHIC,
          assetFrame: 7,
          origin: { x: 0.5, y: 0.5 },
        },
      }
    );
  }
}
