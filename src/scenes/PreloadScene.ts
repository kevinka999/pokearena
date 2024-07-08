import {
  AssetsKeysEnums,
  DataKeysEnums,
  MapKeysEnums,
  SceneKeysEnums,
} from "../types/keys";

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
      key: SceneKeysEnums.PRELOAD,
      active: true,
    });
  }

  preload() {
    this.load.image(MapKeysEnums.TILESET, "/map/tileset.png");
    this.load.tilemapTiledJSON(MapKeysEnums.MAPCONFIG, "/map/map_config.json");

    for (const assetKey in AssetsKeysEnums) {
      this.load.spritesheet(
        assetKey.toUpperCase(),
        `/assets/pokemon/${assetKey.toLowerCase()}.png`,
        {
          frameWidth: 32,
          frameHeight: 32,
        }
      );
    }

    this.load.json(DataKeysEnums.ANIMATIONS, "/data/animations.json");
  }

  create() {
    this.createAnimations();
    this.scene.start(SceneKeysEnums.BATTLE);
  }

  private createAnimations() {
    const animations: AnimationConfig[] = this.cache.json.get(
      DataKeysEnums.ANIMATIONS
    );

    for (const assetKey in AssetsKeysEnums) {
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
