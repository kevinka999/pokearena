export enum AttackTypesEnum {
  MELEE = "MELEE",
  RANGED = "RANGED",
}

export type AttackBaseParams = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  callback?: (sprite: Phaser.Physics.Arcade.Sprite) => void;
};

type Params = {
  spriteKey: string;
  type: AttackTypesEnum;
  damage: number;
} & AttackBaseParams;

export class Attack extends Phaser.Physics.Arcade.Sprite {
  constructor(params: Params) {
    super(params.scene, params.x, params.y, params.spriteKey);
    params.scene.add.existing(this);
    params.scene.physics.world.enableBody(this);

    this.play(`${params.spriteKey}_ANIM`);
    this.on(
      "animationcomplete",
      function (_anim: any, _frame: any, sprite: Attack) {
        if (params.callback) params.callback(sprite);
        sprite?.destroy();
      },
      this
    );
  }
}
