import { AssetsEnums } from "./keys";

export type GamePosition = {
  x: number;
  y: number;
};

export type GameObjectConfig = {
  assetKey: AssetsEnums;
  assetFrame?: number;
  origin?: number;
} & GamePosition;
