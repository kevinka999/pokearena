import { AnimationConfig, GamePosition } from "../types/game";
import {
  AttacksKeysEnums,
  AttackTypesEnum,
  DataKeysEnums,
  PokemonStatus,
} from "../types/keys";
import { ControllerKeysEnum } from "./Controller";
import { nanoid } from "nanoid";
import { Utils } from "./Utils";
import { GameMechanicUtils } from "./GameMechanicUtils";

export type AttackBaseParams = {
  scene: Phaser.Scene;
  position: GamePosition;
  direction: ControllerKeysEnum;
  originId: string;
  status: PokemonStatus;
  callback?: (sprite: Phaser.Physics.Arcade.Sprite) => void;
};

type Params = {
  spriteKey: string[] | string;
  type: AttackTypesEnum;
  damage: number;
} & AttackBaseParams;

export class Attack extends Phaser.Physics.Arcade.Sprite {
  #id!: string;
  #originId!: string;
  #baseDamage!: number;
  #status!: PokemonStatus;
  #type!: AttackTypesEnum;

  constructor(params: Params) {
    const spriteKey = Array.isArray(params.spriteKey)
      ? params.spriteKey[Phaser.Math.Between(0, params.spriteKey.length - 1)]
      : params.spriteKey;

    super(params.scene, params.position.x, params.position.y, spriteKey);
    this.#id = nanoid();
    this.#originId = params.originId;
    this.#baseDamage = params.damage;
    this.#status = params.status;
    this.#type = params.type;
    this.visible = false;
    params.scene.add.existing(this);
    params.scene.physics.world.enableBody(this);

    this.#setExternalConfiguration(spriteKey as AttacksKeysEnums);
    this.rotation = Utils.getRadiansFromDirection(params.direction) ?? 0;

    this.visible = true;
    this.play(`${spriteKey}_ANIM`);
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

  get originId() {
    return this.#originId;
  }

  get damage() {
    return GameMechanicUtils.getAttackDamage(
      this.#baseDamage,
      this.#type,
      this.#status
    );
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
