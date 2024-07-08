import { Tweens } from "phaser";
import { DirectionsEnum } from "./Controller";

type Bounds = Parameters<Phaser.Cameras.Scene2D.BaseCamera["setBounds"]>;

type ControllerParams = {
  scene: Phaser.Scene;
  followObject?: Phaser.GameObjects.Sprite;
  bounds?: Bounds;
};

type FollowOffset = { x: number; y: number };

export class Camera {
  #scene: Phaser.Scene;
  #lastFollowOffsetToGo: FollowOffset;
  #followOffsetTween?: Tweens.Tween;
  #offsetDistancePx = 20;
  #timeToOffsetMs = 500;

  constructor(params: ControllerParams) {
    this.#scene = params.scene;
    this.#lastFollowOffsetToGo = { x: 0, y: 0 };

    if (params.followObject)
      this.#scene.cameras.main.startFollow(params.followObject);

    if (params.bounds) this.#scene.cameras.main.setBounds(...params.bounds);
  }

  get camera() {
    return this.#scene.cameras;
  }

  handleMovingFollowOffset(movingDirection: DirectionsEnum[]) {
    const offsetToGo = this.#getOffsetPositionFromDirections(movingDirection);

    if (
      this.#lastFollowOffsetToGo.x !== offsetToGo.x ||
      this.#lastFollowOffsetToGo.y !== offsetToGo.y
    ) {
      this.#lastFollowOffsetToGo = offsetToGo;
      this.#handleTween(offsetToGo);
    }
  }

  #handleTween(offsetToGo: FollowOffset) {
    if (this.#followOffsetTween) {
      this.#followOffsetTween.destroy();
    }

    this.#followOffsetTween = this.#scene.tweens.add({
      targets: {
        x: this.#scene.cameras.main.followOffset.x,
        y: this.#scene.cameras.main.followOffset.y,
      },
      x: offsetToGo.x,
      y: offsetToGo.y,
      ease: Phaser.Math.Easing.Cubic.Out,
      duration: this.#getTimeRelativeToDistance(offsetToGo),
      onUpdate: function (_tween, value) {
        this.main.setFollowOffset(Math.trunc(value.x), Math.trunc(value.y));
      },
      callbackScope: this.#scene.cameras,
    });
  }

  #getOffsetPositionFromDirections(movingDirection: DirectionsEnum[]) {
    let offsetToGo: FollowOffset = { x: 0, y: 0 };
    if (movingDirection.length === 0) return offsetToGo;

    if (movingDirection.includes(DirectionsEnum.LEFT)) {
      offsetToGo.x = this.#offsetDistancePx;
    } else if (movingDirection.includes(DirectionsEnum.RIGHT)) {
      offsetToGo.x = -this.#offsetDistancePx;
    }

    if (movingDirection.includes(DirectionsEnum.UP)) {
      offsetToGo.y = this.#offsetDistancePx;
    } else if (movingDirection.includes(DirectionsEnum.DOWN)) {
      offsetToGo.y = -this.#offsetDistancePx;
    }

    return offsetToGo;
  }

  #getTimeRelativeToDistance(offsetToGo: FollowOffset) {
    const distanceBetweenX = Math.abs(
      this.#scene.cameras.main.followOffset.x - offsetToGo.x
    );
    const distanceBetweenY = Math.abs(
      this.#scene.cameras.main.followOffset.y - offsetToGo.y
    );

    const relativeTimePerPixel = this.#timeToOffsetMs / this.#offsetDistancePx;
    const biggestDistanceToRun =
      distanceBetweenX > distanceBetweenY ? distanceBetweenX : distanceBetweenY;
    return biggestDistanceToRun * relativeTimePerPixel;
  }
}