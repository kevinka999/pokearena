import { SpriteGameObject } from "../types/game";

export enum AttackTypesEnum {
  MELEE = "MELEE",
  RANGED = "RANGED",
}

export type AttackBaseParams = {
  scene: Phaser.Scene;
  gameObject: SpriteGameObject;
  x: number;
  y: number;
};

type Params = {
  spriteKey: string;
  type: AttackTypesEnum;
  damage: number;
} & AttackBaseParams;

export class Attack extends Phaser.GameObjects.Sprite {
  constructor(params: Params) {
    super(params.scene, params.x, params.y, params.spriteKey);
    params.scene.add.existing(this);
    params.scene.physics.world.enableBody(this);

    this.play(`${params.spriteKey}_ANIM`);
    this.on(
      "animationcomplete",
      function (_anim: any, _frame: any, spriteContext: Attack) {
        spriteContext.destroy();
      },
      this
    );
  }
}
