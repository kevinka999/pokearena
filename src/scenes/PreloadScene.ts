import { AssetsEnums, DataEnums, SceneEnums } from "../types/keys";

type AnimationConfig = {
  key: string;
  frames?: number[];
  frameRate: number;
  repeat: number;
  delay: number;
  yoyo: boolean;
  assetKey: string;
};

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SceneEnums.preload,
      active: true,
    });
  }

  preload() {
    for (const assetKey in AssetsEnums) {
      this.load.spritesheet(
        assetKey.toUpperCase(),
        `/assets/pokemon/${assetKey.toLowerCase()}.png`,
        {
          frameWidth: 32,
          frameHeight: 32,
        }
      );
    }

    this.load.json(DataEnums.animations, "/data/animations.json");
  }

  create() {
    this.createAnimations();
    this.scene.start(SceneEnums.battle);
  }

  private createAnimations() {
    const animations: AnimationConfig[] = this.cache.json.get(
      DataEnums.animations
    );

    for (const assetKey in AssetsEnums) {
      animations?.forEach((animation) => {
        this.anims.create({
          key: `${assetKey.toUpperCase()}_${animation.key}`,
          frames: this.anims.generateFrameNumbers(assetKey.toUpperCase(), {
            frames: animation.frames,
          }),
          frameRate: animation.frameRate,
          repeat: animation.repeat,
          delay: animation.delay,
          yoyo: animation.yoyo,
        });
      });
    }
  }
}
