import { Bot, Pokemon, HealthBar } from "../core";
import { AnimationConfig } from "../types/game";
import { DataKeysEnums, PokemonKeysEnums, SceneKeysEnums } from "../types/keys";

export class HudScene extends Phaser.Scene {
  #player!: Pokemon;
  #bot!: Bot;
  #health!: HealthBar;

  constructor() {
    super({
      key: SceneKeysEnums.BATTLE_HUD,
      active: false,
    });
  }

  create() {
    this.#player = this.registry.get("player");
    this.#bot = this.registry.get("bot");

    this.#createAnimations();
    this.#createLife();
  }

  #createAnimations() {
    let animations: AnimationConfig<PokemonKeysEnums>[] = this.cache.json.get(
      DataKeysEnums.POKEMON_SELECTION_ANIMATIONS
    );
    animations = animations.filter((animation) =>
      [
        this.#bot.gameObject.texture.key,
        this.#player.gameObject.texture.key,
      ].includes(animation.key?.toUpperCase() || "")
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

  #createLife() {
    const frame = this.add.graphics();
    frame.fillStyle(0xffffff, 1.0);
    frame.fillRect(0, 2, 90, 16);

    const sprite = this.#addPokemonContainer(
      this.#player.gameObject.texture.key
    );

    const container = this.add.container(5, 5, [frame, sprite]);

    this.#health = new HealthBar({
      scene: this,
      x: 30,
      y: 5,
      width: 55,
      height: 5,
      initialLife: 100,
      totalLife: 100,
    });

    container.add(this.#health);
  }

  #addPokemonContainer(key: string) {
    const frame = new Phaser.GameObjects.Rectangle(
      this,
      0,
      0,
      25,
      20,
      0x000
    ).setOrigin(0);

    const sprite = new Phaser.GameObjects.Sprite(
      this,
      frame.width / 2,
      frame.height / 2,
      `${key.toUpperCase()}_SELECTION`,
      "0001.png"
    )
      .setOrigin(0.5)
      .setScale(0.8);

    const maskGraphics = this.make.graphics();
    maskGraphics.fillRect(0, 0, 25, 20);

    const mask = maskGraphics.createGeometryMask();
    sprite.setMask(mask);

    return this.add.container(0, 0, [frame, sprite]);
  }

  update() {
    this.#health.setLife(this.#bot.life);
  }
}
