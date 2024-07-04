import { GameObjectConfig } from "../types/game";
import { AnimationEnums, AssetsEnums } from "../types/keys";
import { DirectionsEnum } from "./Controller";

type IdleFrameConfig = Partial<{ [key in DirectionsEnum]: number }>;

export type PlayerParams = {
  scene: Phaser.Scene;
  gameObjectConfig: GameObjectConfig;
  facingDirection?: DirectionsEnum;
  idleFrameConfig: IdleFrameConfig;
  tileSize?: number;
};

export class Player {
  scene: Phaser.Scene;
  assetKey: AssetsEnums;
  gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  facingDirection: DirectionsEnum;
  idleFrameConfig: IdleFrameConfig;

  constructor(params: PlayerParams) {
    this.scene = params.scene;
    this.facingDirection = params.facingDirection ?? DirectionsEnum.DOWN;
    this.idleFrameConfig = params.idleFrameConfig;
    this.assetKey = params.gameObjectConfig.assetKey;

    this.gameObject = this.scene.physics.add
      .sprite(
        params.gameObjectConfig.x,
        params.gameObjectConfig.y,
        params.gameObjectConfig.assetKey,
        this.getAssetFrame()
      )
      .setOrigin(0);
    this.scene.physics.add.existing(this.gameObject, false);
    this.gameObject.body.setCollideWorldBounds(true);

    if (params.gameObjectConfig.origin !== undefined)
      this.gameObject.setOrigin(params.gameObjectConfig.origin);
  }

  movePlayer(direction: DirectionsEnum[]) {
    this.handleMovement(direction);
  }

  private getAssetFrame() {
    switch (this.facingDirection) {
      case DirectionsEnum.DOWN:
        return this.idleFrameConfig.DOWN;
      case DirectionsEnum.UP:
        return this.idleFrameConfig.UP;
      case DirectionsEnum.LEFT:
        return this.idleFrameConfig.LEFT;
      case DirectionsEnum.RIGHT:
        return this.idleFrameConfig.RIGHT;
      default:
        throw new Error("No direction defined");
    }
  }

  private handleMovement(directions: DirectionsEnum[]) {
    if (this.isPlayerNotMoving(directions)) {
      this.gameObject.body.setVelocity(0);
      this.stopAnimation();
    }

    this.handleAnimation(directions);

    if (directions.includes(DirectionsEnum.LEFT)) {
      this.gameObject.body.setVelocityX(-80);
    } else if (directions.includes(DirectionsEnum.RIGHT)) {
      this.gameObject.body.setVelocityX(80);
    }

    if (directions.includes(DirectionsEnum.UP)) {
      this.gameObject.body.setVelocityY(-80);
    } else if (directions.includes(DirectionsEnum.DOWN)) {
      this.gameObject.body.setVelocityY(80);
    }
  }

  private isPlayerNotMoving(directions: DirectionsEnum[]) {
    return (
      directions.length === 0 ||
      (directions.length === 1 && directions.includes(DirectionsEnum.NONE))
    );
  }

  private handleAnimation(directions: DirectionsEnum[]) {
    let animationKey!: AnimationEnums;
    if (directions.includes(DirectionsEnum.UP)) {
      animationKey = AnimationEnums.POKEMON_UP;
    } else if (directions.includes(DirectionsEnum.DOWN)) {
      animationKey = AnimationEnums.POKEMON_DOWN;
    } else if (directions.includes(DirectionsEnum.LEFT)) {
      animationKey = AnimationEnums.POKEMON_LEFT;
    } else if (directions.includes(DirectionsEnum.RIGHT)) {
      animationKey = AnimationEnums.POKEMON_RIGHT;
    }

    if (!animationKey) return;
    const fullKey = `${this.assetKey}_${animationKey}`;

    if (
      !this.gameObject.anims.isPlaying ||
      this.gameObject.anims.currentAnim?.key !== fullKey
    ) {
      this.gameObject.anims.play(fullKey);
    }
  }

  private stopAnimation() {
    const idleFrame = this.gameObject.anims.currentAnim?.frames[1].frame.name;
    this.gameObject.anims.stop();
    if (idleFrame) this.gameObject.setFrame(idleFrame);
  }
}
