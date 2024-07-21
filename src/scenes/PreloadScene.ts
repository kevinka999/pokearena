import { AnimationConfig } from "../types/game";
import {
  PokemonKeysEnums,
  DataKeysEnums,
  MapKeysEnums,
  SceneKeysEnums,
  AttacksKeysEnums,
} from "../types/keys";
import { selectionOptions } from "./SelectionScene";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SceneKeysEnums.PRELOAD,
      active: true,
    });
  }

  preload() {
    this.#preloadTilesets();
    this.#preloadWalkingAnimations();
    this.#preloadAttackAnimations();
    this.#preloadSelectionAnimations();
    this.#preloadSounds();
  }

  create() {
    this.#createSounds();
    this.#createPokemonSelectionAnimations();
    this.#createPokemonWalkingAnimations();
    this.#createAttackAnimations();

    this.global.selectCharacter = PokemonKeysEnums.TORCHIC;
    this.scene.start(SceneKeysEnums.BATTLE);
    // this.scene.switch(SceneKeysEnums.SELECTION);
  }

  #preloadSelectionAnimations() {
    selectionOptions.forEach((pokemonKey) => {
      this.load.atlas(
        `${pokemonKey.toUpperCase()}_SELECTION`,
        `/assets/pokemon/selection/${pokemonKey.toLowerCase()}.png`,
        `/assets/pokemon/selection/${pokemonKey.toLowerCase()}.json`
      );
    });

    this.load.json(
      DataKeysEnums.POKEMON_SELECTION_ANIMATIONS,
      "/data/pokemon_selection_animations.json"
    );
  }

  #preloadSounds() {
    this.global.soundManager.preload(this);
  }

  #preloadAttackAnimations() {
    for (const attackKey in AttacksKeysEnums) {
      this.load.atlas(
        attackKey.toUpperCase(),
        `/assets/attacks/${attackKey.toLowerCase()}.png`,
        `/assets/attacks/${attackKey.toLowerCase()}.json`
      );
    }

    this.load.json(
      DataKeysEnums.ATTACK_ANIMATIONS,
      "/data/attack_animations.json"
    );
  }

  #preloadWalkingAnimations() {
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

    this.load.json(
      DataKeysEnums.POKEMON_WALKING_ANIMATIONS,
      "/data/pokemon_walking_animations.json"
    );
  }

  #preloadTilesets() {
    this.load.image(MapKeysEnums.TILESET, "/map/tileset_extruded.png");
    this.load.tilemapTiledJSON(MapKeysEnums.MAPCONFIG, "/map/map_config.json");
  }

  #createSounds() {
    this.global.soundManager.create(this);
  }

  #createPokemonSelectionAnimations() {
    const animations: AnimationConfig<PokemonKeysEnums>[] = this.cache.json.get(
      DataKeysEnums.POKEMON_SELECTION_ANIMATIONS
    );

    animations.forEach((animation) => {
      this.anims.create({
        key: `${animation.key.toUpperCase()}_SELECTION_ANIM`,
        frames: this.anims.generateFrameNames(
          `${animation.key.toUpperCase()}_SELECTION`,
          {
            zeroPad: 4,
            suffix: ".png",
            start: animation.start,
            end: animation.end,
          }
        ),
        frameRate: animation.frameRate,
        repeat: -1,
      });
    });
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
