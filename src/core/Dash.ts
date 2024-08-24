import { AbilitiesKeysEnum, DepthEnum } from "../types/keys";
import { ControllerKeysEnum } from "./Controller";
import { Utils } from "./Utils";

type Params = {
  scene: Phaser.Scene;
  gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  direction: ControllerKeysEnum;
  onComplete: () => void;
};

export class Dash extends Phaser.Physics.Arcade.Sprite {
  #scene!: Phaser.Scene;

  constructor(params: Params) {
    super(
      params.scene,
      params.gameObject.body.x,
      params.gameObject.body.y,
      AbilitiesKeysEnum.DASH
    );
    this.setScale(0.3);
    this.setOrigin(0);
    this.setDepth(DepthEnum.DASH);
    params.scene.add.existing(this);

    this.#scene = params.scene;

    this.#rotateSprite(params.direction);
    this.#animate();
    this.#handleMovement(
      params.direction,
      params.gameObject,
      params.onComplete
    );
  }

  #animate() {
    this.play(`${AbilitiesKeysEnum.DASH}_ANIM`);
    this.on(
      "animationcomplete",
      function (_anim: any, _frame: any, sprite: Phaser.GameObjects.Sprite) {
        sprite?.destroy();
      }
    );
  }

  #handleMovement(
    direction: ControllerKeysEnum,
    gameObject: Params["gameObject"],
    completeCallback: Params["onComplete"]
  ) {
    switch (direction) {
      case ControllerKeysEnum.A:
        this.#scene.tweens.add({
          targets: { velocity: 0 },
          velocity: -300,
          duration: 200,
          ease: Phaser.Math.Easing.Cubic.Out,
          onUpdate: (_tween, target) => {
            gameObject.body.setVelocityX(target.velocity);
          },
          onComplete: () => {
            gameObject.body.setVelocity(0, 0);
            completeCallback();
          },
          callbackScope: this,
        });
        break;
      case ControllerKeysEnum.D:
        this.#scene.tweens.add({
          targets: { velocity: 0 },
          velocity: 300,
          duration: 200,
          ease: Phaser.Math.Easing.Cubic.Out,
          onUpdate: (_tween, target) => {
            gameObject.body.setVelocityX(target.velocity);
          },
          onComplete: () => {
            gameObject.body.setVelocity(0, 0);
            completeCallback();
          },
          callbackScope: this,
        });
        break;
      case ControllerKeysEnum.W:
        this.#scene.tweens.add({
          targets: { velocity: 0 },
          velocity: -300,
          duration: 200,
          ease: Phaser.Math.Easing.Cubic.Out,
          onUpdate: (_tween, target) => {
            gameObject.body.setVelocityY(target.velocity);
          },
          onComplete: () => {
            gameObject.body.setVelocity(0, 0);
            completeCallback();
          },
          callbackScope: this,
        });
        break;
      case ControllerKeysEnum.S:
        this.#scene.tweens.add({
          targets: { velocity: 0 },
          velocity: 300,
          duration: 200,
          ease: Phaser.Math.Easing.Cubic.Out,
          onUpdate: (_tween, target) => {
            gameObject.body.setVelocityY(target.velocity);
          },
          onComplete: () => {
            gameObject.body.setVelocity(0, 0);
            completeCallback();
          },
          callbackScope: this,
        });
        break;
      default:
        throw new Error("Direction not defined to Dash");
    }
  }

  #rotateSprite(direction: ControllerKeysEnum) {
    const directionVector = Utils.getVectorFromControllerDirection(direction);
    const angleRadians = Phaser.Math.Angle.Between(
      0,
      0,
      directionVector.x,
      directionVector.y
    );

    const centerX = (this.width * this.scaleX) / 2;
    const centerY = (this.height * this.scaleY) / 2;

    this.rotation = angleRadians;

    this.x =
      this.x +
      centerX * (1 - Math.cos(angleRadians)) +
      centerY * Math.sin(angleRadians);
    this.y =
      this.y +
      centerY * (1 - Math.cos(angleRadians)) -
      centerX * Math.sin(angleRadians);
  }
}
