import { SceneEnums } from "../types/scenes";

export class BattleScene extends Phaser.Scene {
  constructor() {
    super({
      key: SceneEnums.battle,
    });
  }
}
