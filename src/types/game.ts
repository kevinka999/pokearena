import { Attack, AttackBaseParams, Pokemon, PokemonIvs } from "../core";

export type GamePosition = {
  x: number;
  y: number;
};

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

export interface IPokemonAttack {
  new (params: AttackBaseParams): Attack;
}

export type AnimationConfig<T = string> = {
  key: T;
  start?: number;
  end?: number;
  frames?: number[];
  frameRate?: number;
  repeat?: number;
  delay?: number;
  yoyo?: boolean;
  assetKey?: string;
  originX?: number;
  originY?: number;
  scale?: number;
  size?: [number, number];
};

export type GameObjectConfig = {
  assetKey: string;
  assetFrame?: number;
  position: GamePosition;
  origin?: [number, number];
  hitbox: [number, number];
  hitboxOffset: [number, number];
};

export type Damage = {
  id: string;
  damage: number;
};
