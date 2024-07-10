import { GameObjectConfig } from "../types/game";
import { AnimationKeysEnums } from "../types/keys";
import { getPointerDirectionInRelationTo } from "../utils";
import { DirectionsEnum } from "./Controller";

type IdleFrameConfig = { [key in DirectionsEnum]: number };

export type PlayerParams = {
  scene: Phaser.Scene;
  gameObjectConfig: GameObjectConfig;
  facingDirection?: DirectionsEnum;
  idleFrameConfig: IdleFrameConfig;
  tileSize?: number;
};

const animationMap: { [key in DirectionsEnum]: AnimationKeysEnums } = {
  [DirectionsEnum.DOWN]: AnimationKeysEnums.POKEMON_DOWN,
  [DirectionsEnum.UP]: AnimationKeysEnums.POKEMON_UP,
  [DirectionsEnum.LEFT]: AnimationKeysEnums.POKEMON_LEFT,
  [DirectionsEnum.RIGHT]: AnimationKeysEnums.POKEMON_RIGHT,
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
          params.facingDirection ?? DirectionsEnum.DOWN
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

  set setFreeze(value: boolean) {
    this.#freeze = value;
  }

  movePlayer(
    moveDirections: DirectionsEnum[],
    pointer: { x: number; y: number }
  ) {
    this.#handleMovement(moveDirections);

    const lookDirection = getPointerDirectionInRelationTo(pointer, {
      x: this.gameObject.x,
      y: this.gameObject.y,
    });
    const isMoving = moveDirections.length > 0;
    this.#handleAnimation(lookDirection, isMoving);
  }

  #getAssetFromDirection(direction: DirectionsEnum) {
    switch (direction) {
      case DirectionsEnum.DOWN:
        return this.#idleFrameConfig.DOWN;
      case DirectionsEnum.UP:
        return this.#idleFrameConfig.UP;
      case DirectionsEnum.LEFT:
        return this.#idleFrameConfig.LEFT;
      case DirectionsEnum.RIGHT:
        return this.#idleFrameConfig.RIGHT;
      default:
        return this.#idleFrameConfig.DOWN;
    }
  }

  #handleMovement(directions: DirectionsEnum[]) {
    if (this.#freeze || directions.length === 0) {
      this.#gameObject.body.setVelocity(0);
      return;
    }

    if (directions.includes(DirectionsEnum.LEFT)) {
      this.#gameObject.body.setVelocityX(-80);
    } else if (directions.includes(DirectionsEnum.RIGHT)) {
      this.#gameObject.body.setVelocityX(80);
    }

    if (directions.includes(DirectionsEnum.UP)) {
      this.#gameObject.body.setVelocityY(-80);
    } else if (directions.includes(DirectionsEnum.DOWN)) {
      this.#gameObject.body.setVelocityY(80);
    }
  }

  #handleAnimation(lookDirection: DirectionsEnum, isMoving: boolean) {
    if (!isMoving) {
      const idleFrame = this.#idleFrameConfig[lookDirection];
      this.#gameObject.anims.stop();
      this.#gameObject.setFrame(idleFrame);
      return;
    }

    const animationKey = animationMap[lookDirection];
    const fullKey = `${this.#assetKey}_${animationKey}`;

    if (
      !this.#gameObject.anims.isPlaying ||
      this.#gameObject.anims.currentAnim?.key !== fullKey
    ) {
      this.#gameObject.anims.play(fullKey);
    }
  }
}
