import {
  PokemonKeysEnums,
  DataKeysEnums,
  MapKeysEnums,
  SceneKeysEnums,
  AttacksKeysEnums,
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
      active: false,
    });
  }

  preload() {
    this.load.image(MapKeysEnums.TILESET, "/map/tileset_extruded.png");
    this.load.tilemapTiledJSON(MapKeysEnums.MAPCONFIG, "/map/map_config.json");

    for (const pokemonKey in PokemonKeysEnums) {
      this.load.spritesheet(
        pokemonKey.toUpperCase(),
        `/assets/pokemon/walking/${pokemonKey.toLowerCase()}.png`,
        {
          frameWidth: 32,
          frameHeight: 32,
        }
      );
    }

    for (const attackKey in AttacksKeysEnums) {
      this.load.spritesheet(
        attackKey.toUpperCase(),
        `/assets/attacks/${attackKey.toLowerCase()}.png`,
        {
          frameWidth: 16,
          frameHeight: 16,
        }
      );
    }

    this.load.json(DataKeysEnums.ANIMATIONS, "/data/animations.json");
  }

  create() {
    this.anims.create({
      key: `${AttacksKeysEnums.RAZOR_LEAF}_ANIM`,
      frames: this.anims.generateFrameNumbers(AttacksKeysEnums.RAZOR_LEAF),
      frameRate: 20,
    });

    this.#createAnimations();
    this.scene.start(SceneKeysEnums.BATTLE);
  }

  #createAnimations() {
    const animations: AnimationConfig[] = this.cache.json.get(
      DataKeysEnums.ANIMATIONS
    );

    for (const assetKey in PokemonKeysEnums) {
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
