import { Pokemon, PokemonIvs } from "../core";

export type GamePosition = {
  x: number;
  y: number;
};

export type GameObjectConfig = {
  assetKey: string;
  assetFrame?: number;
  origin?: { x?: number; y?: number };
} & GamePosition;

export type SpriteGameObject =
  | Phaser.GameObjects.Image
  | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

export type PlayerPokemonParams = {
  scene: Phaser.Scene;
  level: number;
  ivs?: PokemonIvs;
};

export interface IPlayerPokemon {
  new (params: PlayerPokemonParams): Pokemon;
}
