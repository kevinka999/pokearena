import { nanoid } from "nanoid";
import { GameObjectConfig } from "../types/game";
import { AnimationKeysEnums, DepthEnum } from "../types/keys";
import { ControllerKeysEnum, movimentationDirections } from "./Controller";

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
    if (this.#freeze) return;
    const filteredMovimentationDirections = moveDirections.filter((direction) =>
      movimentationDirections.includes(direction)
    );
    const isMoving = filteredMovimentationDirections?.length > 0;

    this.#handleMovement(filteredMovimentationDirections);
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
    if (directions?.length === 0) {
      this.#gameObject.body.setVelocity(0, 0);
      return;
    }

    const speed = 80;
    let velocityX = 0;
    let velocityY = 0;

    const isLeftPressed =
      directions.includes(ControllerKeysEnum.A) ||
      directions.includes(ControllerKeysEnum.ARROW_LEFT);
    const isRightPressed =
      directions.includes(ControllerKeysEnum.D) ||
      directions.includes(ControllerKeysEnum.ARROW_RIGHT);
    const isUpPressed =
      directions.includes(ControllerKeysEnum.W) ||
      directions.includes(ControllerKeysEnum.ARROW_UP);
    const isDownPressed =
      directions.includes(ControllerKeysEnum.S) ||
      directions.includes(ControllerKeysEnum.ARROW_DOWN);

    if (isLeftPressed) {
      velocityX -= speed;
    } else if (isRightPressed) {
      velocityX += speed;
    }

    if (isUpPressed) {
      velocityY -= speed;
    } else if (isDownPressed) {
      velocityY += speed;
    }

    if (velocityX !== 0 && velocityY !== 0) {
      const diagonalFactor = 1 / Math.sqrt(2);
      velocityX *= diagonalFactor;
      velocityY *= diagonalFactor;
    }

    this.#gameObject.body.setVelocity(velocityX, velocityY);
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
