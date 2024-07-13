import { AnimationConfig } from "../types/game";
import {
  PokemonKeysEnums,
  DataKeysEnums,
  MapKeysEnums,
  SceneKeysEnums,
  AttacksKeysEnums,
} from "../types/keys";

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
      this.load.atlas(
        attackKey.toUpperCase(),
        `/assets/attacks/${attackKey.toLowerCase()}.png`,
        `/assets/attacks/${attackKey.toLowerCase()}.json`
      );
    }

    this.load.json(
      DataKeysEnums.POKEMON_WALKING_ANIMATIONS,
      "/data/pokemon_walking_animations.json"
    );

    this.load.json(
      DataKeysEnums.ATTACK_ANIMATIONS,
      "/data/attack_animations.json"
    );
  }

  create() {
    this.#createPokemonWalkingAnimations();
    this.#createAttackAnimations();
    this.scene.switch(SceneKeysEnums.BATTLE);
  }

  #createPokemonWalkingAnimations() {
    const animations: AnimationConfig<PokemonKeysEnums>[] = this.cache.json.get(
      DataKeysEnums.POKEMON_WALKING_ANIMATIONS
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

  #createAttackAnimations() {
    const animations: AnimationConfig<AttacksKeysEnums>[] = this.cache.json.get(
      DataKeysEnums.ATTACK_ANIMATIONS
    );
    for (const attackKey in AttacksKeysEnums) {
      const animationData = animations.find(
        (animation) => animation.key === attackKey.toLowerCase()
      );

      this.anims.create({
        key: `${attackKey.toUpperCase()}_ANIM`,
        frames: this.anims.generateFrameNames(`${attackKey.toUpperCase()}`, {
          prefix: `${animationData?.key.toLowerCase()}-`,
          suffix: ".png",
          start: animationData?.start,
          end: animationData?.end,
        }),
        frameRate: animationData?.frameRate,
        repeat: animationData?.repeat ?? 0,
        delay: animationData?.delay ?? 0,
        yoyo: animationData?.yoyo ?? false,
      });
    }
  }
}
