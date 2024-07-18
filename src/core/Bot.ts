import { Damage, GameObjectConfig } from "../types/game";

export type BotParams = {
  scene: Phaser.Scene;
  gameObjectConfig: GameObjectConfig;
};

export class Bot {
  #scene: Phaser.Scene;
  #gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  #events!: Phaser.Events.EventEmitter;
  #life!: number;
  #damages: Damage[];

  constructor(params: BotParams) {
    this.#scene = params.scene;
    this.#gameObject = this.#scene.physics.add
      .sprite(
        params.gameObjectConfig.position.x,
        params.gameObjectConfig.position.y,
        params.gameObjectConfig.assetKey,
        1
      )
      .setOrigin(0);
    this.#gameObject.setSize(...params.gameObjectConfig.hitbox);
    this.#gameObject.setOffset(...params.gameObjectConfig.hitboxOffset);
    this.#gameObject.body.setCollideWorldBounds(true);
    this.#gameObject.setPushable(false);
    this.#scene.physics.add.existing(this.gameObject, false);

    this.#events = new Phaser.Events.EventEmitter();
    this.#life = 100;
    this.#damages = [];

    this.#configureEvents();

    if (params.gameObjectConfig.origin !== undefined) {
      this.gameObject.setOrigin(...params.gameObjectConfig.origin);
    }
  }

  get gameObject() {
    return this.#gameObject;
  }

  get events() {
    return this.#events;
  }

  #configureEvents() {
    this.#events.on("damage", this.#handleDamage, this);
  }

  #handleDamage(damage: Damage) {
    const index = this.#damages?.findIndex((dmg) => dmg.id === damage.id);
    if (index !== -1) return;

    this.#damages.push(damage);
    this.#life -= damage.damage;
    if (this.#life <= 0) this.#handleDeath();
  }

  #handleDeath() {
    this.gameObject.destroy();
  }
}
