import { AnimationConfig } from "../types/game";
import { AttacksKeysEnums, DataKeysEnums } from "../types/keys";
import { ControllerKeysEnum } from "./Controller";
import { Utils } from "./Utils";

export enum AttackTypesEnum {
  PHYSICAL = "PHYSICAL",
  SPECIAL = "SPECIAL",
}

export type AttackBaseParams = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  direction: ControllerKeysEnum;
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

    const animations: AnimationConfig<AttacksKeysEnums>[] =
      this.scene.cache.json.get(DataKeysEnums.ATTACK_ANIMATIONS);
    const animationData = animations.find(
      (animation) => animation.key === params.spriteKey.toLowerCase()
    );

    if (animationData) {
      this.#setAttackConfiguration(animationData);
    }

    params.scene.add.existing(this);
    params.scene.physics.world.enableBody(this);
    this.rotation = Utils.getRadiansFromDirection(params.direction) ?? 0;
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

  #setAttackConfiguration(configuration: AnimationConfig<AttacksKeysEnums>) {
    this.setScale(configuration.scale);
  }
}
