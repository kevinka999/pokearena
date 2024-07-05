import { GameObjectConfig } from "../types/game";
import { AnimationEnums, AssetsEnums } from "../types/keys";
import { DirectionsEnum } from "./Controller";

type IdleFrameConfig = { [key in DirectionsEnum]: number };

export type PlayerParams = {
  scene: Phaser.Scene;
  gameObjectConfig: GameObjectConfig;
  facingDirection?: DirectionsEnum;
  idleFrameConfig: IdleFrameConfig;
  tileSize?: number;
};

const animationMap: { [key in DirectionsEnum]: AnimationEnums } = {
  [DirectionsEnum.DOWN]: AnimationEnums.POKEMON_DOWN,
  [DirectionsEnum.UP]: AnimationEnums.POKEMON_UP,
  [DirectionsEnum.LEFT]: AnimationEnums.POKEMON_LEFT,
  [DirectionsEnum.RIGHT]: AnimationEnums.POKEMON_RIGHT,
};

export class Player {
  #scene: Phaser.Scene;
  #assetKey: AssetsEnums;
  #gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #idleFrameConfig: IdleFrameConfig;

  constructor(params: PlayerParams) {
    this.#scene = params.scene;
    this.#idleFrameConfig = params.idleFrameConfig;
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
    this.#scene.physics.add.existing(this.gameObject, false);
    // this.#gameObject.body.setCollideWorldBounds(true);

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

  movePlayer(
    moveDirection: DirectionsEnum[],
    pointer: { x: number; y: number }
  ) {
    const isMoving = moveDirection.length > 0;
    this.#handleMovement(moveDirection);

    const lookDirection = this.#getLookDirection(pointer);
    this.#handleAnimation(lookDirection, isMoving);
  }

  #getLookDirection(pointer: { x: number; y: number }) {
    const pointerDirectionInGameObjectRelation = Math.trunc(
      Math.atan2(pointer.y - this.#gameObject.y, pointer.x - this.#gameObject.x)
    );

    let direction: DirectionsEnum = DirectionsEnum.DOWN;
    if (
      Object.is(pointerDirectionInGameObjectRelation, -0) ||
      pointerDirectionInGameObjectRelation === -2 ||
      pointerDirectionInGameObjectRelation === -1
    ) {
      direction = DirectionsEnum.UP;
    } else if (pointerDirectionInGameObjectRelation === 0) {
      direction = DirectionsEnum.RIGHT;
    } else if (pointerDirectionInGameObjectRelation === 1) {
      direction = DirectionsEnum.DOWN;
    } else if (
      pointerDirectionInGameObjectRelation === -3 ||
      pointerDirectionInGameObjectRelation === 2 ||
      pointerDirectionInGameObjectRelation === 3
    ) {
      direction = DirectionsEnum.LEFT;
    }

    return direction;
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
    if (directions.length === 0) {
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
