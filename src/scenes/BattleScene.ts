import { Background, Camera, Controller, Pokemon, Bot, Attack } from "../core";
import { PokemonKeysEnums, SceneKeysEnums } from "../types/keys";

export class BattleScene extends Phaser.Scene {
  #pokemon!: Pokemon;
  #bot!: Bot;
  #controller!: Controller;
  #camera!: Camera;
  #background!: Background;

  constructor() {
    super({
      key: SceneKeysEnums.BATTLE,
      active: false,
    });
  }

  create() {
    this.#controller = new Controller({ scene: this });
    this.#background = new Background({ scene: this });
    const PlayerPokemon = this.global.getSelectedPokemonClass();
    this.#pokemon = new PlayerPokemon({
      scene: this,
      level: 100,
    });
    this.#bot = new Bot({
      scene: this,
      gameObjectConfig: {
        position: { x: 0, y: 0 },
        hitbox: [16, 16],
        hitboxOffset: [8, 14],
        assetKey: PokemonKeysEnums.CHIKORITA,
        assetFrame: 7,
        origin: [0.5, 0.5],
      },
    });
    this.#camera = new Camera({
      scene: this,
      followObject: this.#pokemon.gameObject,
      bounds: [
        0,
        0,
        this.#background.displayWidth,
        this.#background.displayHeight,
      ],
    });

    this.#background.setSpawnPoint(this.#pokemon.gameObject);
    this.#background.setSpawnPoint(this.#bot.gameObject);
    this.#background.addCollider(this.#pokemon.gameObject);

    this.#pokemon.attacks;

    this.physics.add.collider(this.#pokemon.gameObject, this.#bot.gameObject);
    this.physics.add.overlap(
      this.#pokemon.attacks,
      this.#bot.gameObject,
      (_botSprite, attackSprite) => {
        const attack = attackSprite as Attack;
        this.#bot.events.emit("damage", {
          id: attack.id,
          damage: attack.damage,
        });
      },
      undefined,
      this.#bot.events
    );

    this.#background.turnOnDebugMode();
  }

  update() {
    const pointer = {
      x: this.input.mousePointer.worldX,
      y: this.input.mousePointer.worldY,
    };
    const keysPressed = this.#controller.getKeysPressed();
    this.#pokemon.movePlayer(keysPressed, pointer);
    this.#camera.handleMovingFollowOffset(keysPressed);
  }
}
