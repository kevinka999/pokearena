import { Bot, Pokemon, HealthBar } from "../core";
import { SceneKeysEnums } from "../types/keys";

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

    this.#createLife();
  }

  #createLife() {
    const frame = new Phaser.GameObjects.Rectangle(
      this,
      0,
      0,
      50,
      10,
      0xffffff
    ).setOrigin(0);

    this.#health = new HealthBar({
      scene: this,
      x: 5,
      y: 2.5,
      width: 40,
      height: 5,
      initialLife: 100,
      totalLife: 100,
    });

    this.add.container(0, 0, [frame, this.#health]);
  }

  update() {
    this.#health.setLife(this.#bot.life);
  }
}
