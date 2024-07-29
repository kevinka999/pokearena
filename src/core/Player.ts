import { nanoid } from "nanoid";
import { GameObjectConfig } from "../types/game";
import { AnimationKeysEnums, DepthEnum } from "../types/keys";
import { ControllerKeysEnum } from "./Controller";

type IdleFrameConfig = { [key in ControllerKeysEnum]?: number };

export type PlayerParams = {
  scene: Phaser.Scene;
  gameObjectConfig: GameObjectConfig;
  facingDirection?: ControllerKeysEnum;
  idleFrameConfig: IdleFrameConfig;
  tileSize?: number;
};

const animationMap: {
  [key in ControllerKeysEnum]?: AnimationKeysEnums;
} = {
  [ControllerKeysEnum.S]: AnimationKeysEnums.POKEMON_DOWN,
  [ControllerKeysEnum.W]: AnimationKeysEnums.POKEMON_UP,
  [ControllerKeysEnum.A]: AnimationKeysEnums.POKEMON_LEFT,
  [ControllerKeysEnum.D]: AnimationKeysEnums.POKEMON_RIGHT,
};

export class Player {
  #id!: string;
  #scene: Phaser.Scene;
  #assetKey: string;
  #gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #idleFrameConfig: IdleFrameConfig;
  #lookDirection!: ControllerKeysEnum;
  #freeze!: boolean;

  constructor(params: PlayerParams) {
    this.#scene = params.scene;
    this.#idleFrameConfig = params.idleFrameConfig;
    this.#freeze = false;
    this.#assetKey = params.gameObjectConfig.assetKey;
    this.#lookDirection = params.facingDirection ?? ControllerKeysEnum.S;
    this.#id = nanoid();
    this.#gameObject = this.#scene.physics.add
      .sprite(
        params.gameObjectConfig.position.x,
        params.gameObjectConfig.position.y,
        params.gameObjectConfig.assetKey,
        this.#getAssetFromDirection(this.#lookDirection)
      )
      .setOrigin(0);
    this.#gameObject.setSize(...params.gameObjectConfig.hitbox);
    this.#gameObject.setOffset(...params.gameObjectConfig.hitboxOffset);
    this.#gameObject.body.setCollideWorldBounds(true);
    this.#gameObject.setPushable(false);
    this.#scene.physics.add.existing(this.gameObject, false);
    this.#gameObject.setDepth(DepthEnum.PLAYER);

    if (params.gameObjectConfig.origin !== undefined) {
      this.gameObject.setOrigin(...params.gameObjectConfig.origin);
    }
  }

  get id() {
    return this.#id;
  }

  get gameObject() {
    return this.#gameObject;
  }

  get lookDirection() {
    return this.#lookDirection;
  }

  get freeze() {
    return this.freeze;
  }

  set freeze(value: boolean) {
    this.#freeze = value;
  }

  movePlayer(
    moveDirections: ControllerKeysEnum[],
    lookDirection: ControllerKeysEnum
  ) {
    this.#handleMovement(moveDirections);

    const isMoving = moveDirections.length > 0;
    this.#handleLookDirection(lookDirection, isMoving);
  }

  #getAssetFromDirection(direction: ControllerKeysEnum) {
    switch (direction) {
      case ControllerKeysEnum.S:
        return this.#idleFrameConfig.W;
      case ControllerKeysEnum.W:
        return this.#idleFrameConfig.S;
      case ControllerKeysEnum.A:
        return this.#idleFrameConfig.A;
      case ControllerKeysEnum.D:
        return this.#idleFrameConfig.D;
      default:
        return this.#idleFrameConfig.S;
    }
  }

  #handleMovement(directions: ControllerKeysEnum[]) {
    if (this.#freeze || directions.length === 0) {
      this.#gameObject.body.setVelocity(0);
      return;
    }

    if (directions.includes(ControllerKeysEnum.A)) {
      this.#gameObject.body.setVelocityX(-80);
    } else if (directions.includes(ControllerKeysEnum.D)) {
      this.#gameObject.body.setVelocityX(80);
    }

    if (directions.includes(ControllerKeysEnum.W)) {
      this.#gameObject.body.setVelocityY(-80);
    } else if (directions.includes(ControllerKeysEnum.S)) {
      this.#gameObject.body.setVelocityY(80);
    }
  }

  #handleLookDirection(lookDirection: ControllerKeysEnum, isMoving: boolean) {
    this.#lookDirection = lookDirection;
    if (!isMoving) {
      const idleFrame = this.#idleFrameConfig[lookDirection];
      if (idleFrame === undefined) return;
      this.#gameObject.anims.stop();
      this.#gameObject.setFrame(idleFrame);
      return;
    }

    const animationKey = animationMap[lookDirection];
    if (!animationKey) return;
    const fullKey = `${this.#assetKey}_${animationKey}`;

    if (
      !this.#gameObject.anims.isPlaying ||
      this.#gameObject.anims.currentAnim?.key !== fullKey
    ) {
      this.#gameObject.anims.play(fullKey);
    }
  }
}
