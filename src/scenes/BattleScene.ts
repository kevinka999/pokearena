import { Background, Camera, Controller, Pokemon, Bot, Attack } from "../core";
import { Utils } from "../core/Utils";
import { Squirtle } from "../pokemons";
import { GamePosition } from "../types/game";
import { SceneKeysEnums } from "../types/keys";

export class BattleScene extends Phaser.Scene {
  #player!: Pokemon;
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
    this.#init();
    this.#handleAddPlayer();
    this.#handleAddBot();

    this.#handleCollision();

    this.scene.launch(SceneKeysEnums.BATTLE_HUD);
    this.#background.turnOnDebugMode();
  }

  update(timer: number, delta: number) {
    this.#handlePlayerActions(timer);
    // this.#handleBotActions(timer);
  }

  #init() {
    const sceneWidth = 320;
    const sceneHeight = 180;

    const scaleX = this.scale.width / sceneWidth;
    const scaleY = this.scale.height / sceneHeight;
    const scale = Math.min(scaleX, scaleY);

    this.cameras.main.setZoom(scale);
    this.#controller = new Controller({ scene: this });
    this.#background = new Background({ scene: this });
    this.#camera = new Camera({
      scene: this,
      bounds: [
        0,
        0,
        this.#background.displayWidth,
        this.#background.displayHeight,
      ],
    });
  }

  #handleAddPlayer() {
    const PlayerPokemon = this.global.getSelectedPokemonClass();
    this.#player = new PlayerPokemon({
      scene: this,
      level: 1,
    });

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const vector = Utils.getVectorDirection(
        { x: pointer.worldX, y: pointer.worldY },
        { x: this.#player.gameObject.x, y: this.#player.gameObject.y }
      );

      this.#player.primaryAttack(this.time.now, vector);
    });

    this.#background.setSpawnPoint(this.#player.gameObject);
    this.#camera.setFollowObject(this.#player.gameObject);
    this.registry.set("player", this.#player);
  }

  #handleAddBot() {
    this.#bot = new Bot(new Squirtle({ level: 1, scene: this }));
    this.#bot.pokemon.gameObject.setPosition(250, 120);
    this.registry.set("bot", this.#bot);
  }

  #handleCollision() {
    this.#background.addCollider(this.#player.gameObject);
    this.#background.addCollider(this.#bot.pokemon.gameObject);

    this.physics.add.collider(
      this.#player.gameObject,
      this.#bot.pokemon.gameObject
    );

    this.physics.add.overlap(
      this.#player.attacks,
      this.#bot.pokemon.gameObject,
      (_botSprite, attackSprite) => {
        const attack = attackSprite as Attack;
        this.global.events.emit(`damage_${this.#bot.pokemon.id}`, {
          id: attack.id,
          damage: attack.damage,
          originId: attack.originId,
        });
      }
    );
    this.physics.add.overlap(
      this.#bot.pokemon.attacks,
      this.#player.gameObject,
      (_botSprite, attackSprite) => {
        const attack = attackSprite as Attack;
        this.global.events.emit(`damage_${this.#player.id}`, {
          id: attack.id,
          damage: attack.damage,
          originId: attack.originId,
        });
      }
    );
  }

  #handlePlayerActions(timer: number) {
    const pointer = this.cameras.main.getWorldPoint(
      this.input.mousePointer.worldX,
      this.input.mousePointer.worldY
    );
    const vector = Utils.getVectorDirection(
      { x: pointer.x, y: pointer.y },
      { x: this.#player.gameObject.x, y: this.#player.gameObject.y }
    );
    const lookDirection = Utils.getControllerDirectionFromVector(vector);
    const playerKeysPressed = this.#controller.getKeysPressed();

    this.#player.handleCooldown(timer);
    this.#player.dash(timer, playerKeysPressed);
    this.#player.movePlayer(playerKeysPressed, lookDirection);
    this.#camera.handleMovingFollowOffset(playerKeysPressed);
  }

  #handleBotActions(timer: number) {
    const targetPosition: GamePosition = {
      x: this.#player.gameObject.x,
      y: this.#player.gameObject.y,
    };

    this.#bot.handleMovement(targetPosition);
    this.#bot.handleAttack(targetPosition, timer);
  }
}
