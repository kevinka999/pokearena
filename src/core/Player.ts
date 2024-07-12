import { GameObjectConfig } from "../types/game";
import { AnimationKeysEnums } from "../types/keys";
import { ControllerKeysEnum } from "./Controller";
import { Utils } from "./Utils";

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
  #scene: Phaser.Scene;
  #assetKey: string;
  #gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #idleFrameConfig: IdleFrameConfig;
  #freeze!: boolean;

  constructor(params: PlayerParams) {
    this.#scene = params.scene;
    this.#idleFrameConfig = params.idleFrameConfig;
    this.#freeze = false;
    this.#assetKey = params.gameObjectConfig.assetKey;
    this.#gameObject = this.#scene.physics.add
      .sprite(
        params.gameObjectConfig.x,
        params.gameObjectConfig.y,
        params.gameObjectConfig.assetKey,
        this.#getAssetFromDirection(
          params.facingDirection ?? ControllerKeysEnum.S
        )
      )
      .setOrigin(0);
    this.#gameObject.setSize(16, 24);
    this.#scene.physics.add.existing(this.gameObject, false);
    this.#gameObject.body.setCollideWorldBounds(true);

    if (params.gameObjectConfig.origin !== undefined) {
      this.gameObject.setOrigin(
        params.gameObjectConfig.origin.x,
        params.gameObjectConfig.origin.y
      );
    }
  }

  get gameObject() {
    return this.#gameObject;
  }

  set freeze(value: boolean) {
    this.#freeze = value;
  }

  movePlayer(
    moveDirections: ControllerKeysEnum[],
    pointer: { x: number; y: number }
  ) {
    this.#handleMovement(moveDirections);

    const lookDirection = Utils.getPointerDirectionInRelationTo(pointer, {
      x: this.gameObject.x,
      y: this.gameObject.y,
    });
    const isMoving = moveDirections.length > 0;
    this.#handleAnimation(lookDirection, isMoving);
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

  #handleAnimation(lookDirection: ControllerKeysEnum, isMoving: boolean) {
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
