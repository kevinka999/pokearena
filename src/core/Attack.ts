import { SpriteGameObject } from "../types/game";

export enum AttackTypesEnum {
  MELEE = "MELEE",
  RANGED = "RANGED",
}

export type AttackBaseParams = {
  scene: Phaser.Scene;
  gameObject: SpriteGameObject;
};

type Params = {
  spriteKey: string;
  type: AttackTypesEnum;
  damage: number;
} & AttackBaseParams;

export class Attack extends Phaser.GameObjects.Sprite {
  constructor(params: Params) {
    const x = params.gameObject.x;
    const y = params.gameObject.y;

    super(params.scene, x, y, params.spriteKey);
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
