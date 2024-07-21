import { Bot, Pokemon, HealthBar } from "../core";
import { Utils } from "../core/Utils";
import { GamePosition, PokemonTypes } from "../types/game";
import { SceneKeysEnums } from "../types/keys";

export class HudScene extends Phaser.Scene {
  #player!: Pokemon;
  #bot!: Bot;
  #playerHealth!: HealthBar;
  #botHealth!: HealthBar;
  #width: number = 480; // 1920 / 4 (4 columns grid)
  #margin: number = 20;

  constructor() {
    super({
      key: SceneKeysEnums.BATTLE_HUD,
      active: false,
    });
  }

  create() {
    this.#player = this.registry.get("player");
    this.#bot = this.registry.get("bot");

    this.#playerHealth = this.#createLife(
      "left",
      this.#player.gameObject.texture.key,
      this.#player.type
    );
    this.#botHealth = this.#createLife(
      "right",
      this.#bot.pokemon.gameObject.texture.key,
      this.#bot.pokemon.type
    );
  }

  #createLife(position: "right" | "left", key: string, types: PokemonTypes[]) {
    const positionX = position === "left" ? this.#margin : this.#width * 3;
    const frameWidth = this.#width - this.#margin * 2;

    const container = this.add.container(positionX, this.#margin);
    const frame = this.add.graphics();
    frame.fillStyle(0xffffff, 1);
    frame.lineStyle(6, 0x000, 0.5);
    frame.fillRect(0, 0, frameWidth, 130);
    frame.strokeRect(0, 0, frameWidth, 130);

    const { width: spriteWidth, container: spriteContainer } =
      this.#addPokemonContainer(types, key, { x: container.x, y: container.y });

    const healthSize = frameWidth - spriteWidth - this.#margin * 2;
    const healthBar = new HealthBar({
      scene: this,
      x: spriteWidth + this.#margin,
      y: 30,
      width: healthSize,
      height: 30,
      initialLife: 100,
      totalLife: 100,
    });

    const text = this.add.text(
      spriteWidth + this.#margin,
      65,
      key.toUpperCase(),
      {
        fontSize: 32,
        color: "#000",
        font: "48px retro",
      }
    );

    container.add([frame, spriteContainer, healthBar, text]);
    return healthBar;
  }

  #addPokemonContainer(
    type: PokemonTypes[],
    key: string,
    position: GamePosition
  ): { width: number; container: Phaser.GameObjects.Container } {
    const container = this.add.container(0, 0);
    const frameWidth = 150;
    const frame = this.add.graphics();
    frame.fillStyle(Utils.getBackgroundColorFromTypes(type), 0.8);
    frame.lineStyle(6, 0x000, 0.5);
    frame.fillRect(0, 0, frameWidth, 130);
    frame.strokeRect(0, 0, frameWidth, 130);

    const sprite = new Phaser.GameObjects.Sprite(
      this,
      150 / 2,
      130 / 2,
      `${key.toUpperCase()}_SELECTION`,
      "0001.png"
    )
      .setScale(5)
      .setOrigin(0.4, 0.5);

    // mask is not related to container so it need to specify
    // the x and y of the starting container
    const maskGraphics = this.make.graphics();
    maskGraphics.fillRect(position.x, position.y, 150, 130);
    const mask = maskGraphics.createGeometryMask();
    sprite.setMask(mask);

    container.add([frame, sprite]);
    return { width: frameWidth, container };
  }

  update() {
    this.#playerHealth.setLife(this.#player.life);
    this.#botHealth.setLife(this.#bot.pokemon.life);
  }
}
