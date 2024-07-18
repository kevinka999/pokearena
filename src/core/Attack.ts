import { AnimationConfig, GamePosition } from "../types/game";
import { AttacksKeysEnums, DataKeysEnums } from "../types/keys";
import { ControllerKeysEnum } from "./Controller";
import { nanoid } from "nanoid";
import { Utils } from "./Utils";

export enum AttackTypesEnum {
  PHYSICAL = "PHYSICAL",
  SPECIAL = "SPECIAL",
}

export type AttackBaseParams = {
  scene: Phaser.Scene;
  position: GamePosition;
  direction: ControllerKeysEnum;
  callback?: (sprite: Phaser.Physics.Arcade.Sprite) => void;
};

type Params = {
  spriteKey: string;
  type: AttackTypesEnum;
  damage: number;
} & AttackBaseParams;

export class Attack extends Phaser.Physics.Arcade.Sprite {
  #id!: string;
  #damage!: number;

  constructor(params: Params) {
    super(params.scene, params.position.x, params.position.y, params.spriteKey);
    this.#id = nanoid();
    this.#damage = params.damage;
    this.visible = false;
    params.scene.add.existing(this);
    params.scene.physics.world.enableBody(this);

    this.#setExternalConfiguration(params.spriteKey as AttacksKeysEnums);
    this.rotation = Utils.getRadiansFromDirection(params.direction) ?? 0;

    this.visible = true;
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

  get id() {
    return this.#id;
  }

  get damage() {
    return this.#damage;
  }

  #setExternalConfiguration(key: AttacksKeysEnums) {
    const animationsFromCache: AnimationConfig<AttacksKeysEnums>[] =
      this.scene.cache.json.get(DataKeysEnums.ATTACK_ANIMATIONS);
    const configuration = animationsFromCache.find(
      (animation) => animation.key === key.toLowerCase()
    );
    if (!configuration) return;

    const scale = configuration.scale || 1;
    this.setScale(scale);
    if (configuration?.size) {
      this?.setSize(
        configuration?.size[0] / scale,
        configuration?.size[1] / scale
      );
    }
  }
}
