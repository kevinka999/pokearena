import { AssetsKeysEnums } from "./keys";

export type GamePosition = {
  x: number;
  y: number;
};

export type GameObjectConfig = {
  assetKey: AssetsKeysEnums;
  assetFrame?: number;
  origin?: { x?: number; y?: number };
} & GamePosition;
