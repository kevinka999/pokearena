import {
  Damage,
  GamePosition,
  IPokemonAttack,
  PokemonTypes,
} from "../types/game";
import { PokemonStatus } from "../types/keys";
import { ControllerKeysEnum } from "./Controller";
import { GameMechanicUtils } from "./GameMechanicUtils";
import { Player, PlayerParams } from "./Player";

type Moveset = {
  primary: IPokemonAttack;
  secondary: IPokemonAttack;
};

export type PokemonBaseParams = {
  level: number;
  ivs: PokemonStatus;
  type: PokemonTypes[];
  moveset: Moveset;
};

export enum ColldownEnum {
  PRIMARY_ATTACK = "PRIMARY_ATTACK",
  DASH = "DASH",
}

const COOLDOWN_MAPPER: Record<ColldownEnum, number> = {
  DASH: 5000,
  PRIMARY_ATTACK: 1000,
};

export class Pokemon extends Player {
  #scene: Phaser.Scene;
  #level!: number;
  #ivs!: PokemonStatus;
  #status!: PokemonStatus;
  #type!: PokemonTypes[];
  #moveset!: Moveset;
  #attacks: Phaser.Physics.Arcade.Group;
  #totalLife!: number;
  #life!: number;
  #damages: Damage[] = [];
  #cooldown: Map<ColldownEnum, number> = new Map();

  constructor(
    pokemonParams: PokemonBaseParams,
    playerParams: Omit<PlayerParams, "idleFrameConfig">
  ) {
    super({
      ...playerParams,
      idleFrameConfig: {
        [ControllerKeysEnum.S]: 4,
        [ControllerKeysEnum.W]: 0,
        [ControllerKeysEnum.A]: 1,
        [ControllerKeysEnum.D]: 5,
      },
    });

    this.#scene = playerParams.scene;
    this.#level = pokemonParams.level;
    this.#ivs = pokemonParams.ivs;
    this.#type = pokemonParams.type;
    this.#moveset = pokemonParams.moveset;
    this.#attacks = this.#scene.physics.add.group();

    this.#status = GameMechanicUtils.getStatusFromLevel(this.#level, this.#ivs);
    this.#totalLife = this.#status.HP;
    this.#life = this.#status.HP;
    console.log(this.#status.HP);

    this.#configureEvents();
  }

  get type() {
    return this.#type;
  }

  get attacks() {
    return this.#attacks;
  }

  get totalLife() {
    return this.#totalLife;
  }

  get life() {
    return this.#life;
  }

  get damages() {
    return this.#damages;
  }

  #configureEvents() {
    this.#scene.global.events.on(`damage_${this.id}`, this.#handleDamage, this);
  }

  #handleDamage(damage: Damage) {
    const isFromSameOrigin = damage.originId === this.id;
    if (isFromSameOrigin) return;

    const index = this.damages.findIndex((dmg) => dmg.id === damage.id);
    if (index !== -1) return;

    this.damages.push(damage);
    this.#displayDamage(damage.damage);
    const newLife = (this.#life -= damage.damage);
    this.#life = newLife >= 0 ? newLife : 0;
    if (this.#life === 0) this.#handleDeath();
  }

  #displayDamage(damageInfo: number) {
    const bodyPosition: GamePosition = {
      x: this.gameObject.body.x + this.gameObject.body.width / 2, // middle of the body
      y: this.gameObject.body.y + 2, // 2px bellow the top of the sprite,
    };
    const text = this.#scene.add
      .text(bodyPosition.x, bodyPosition.y, damageInfo.toString(), {
        fontSize: 32,
        color: "#eb4949",
        fontFamily: "retro",
      })
      .setStroke("#000", 12)
      .setOrigin(0.5)
      .setScale(0.2);

    this.#scene.tweens.add({
      targets: text,
      y: bodyPosition.y - 10,
      duration: 500,
      ease: Phaser.Math.Easing.Cubic.Out,
      onComplete: function () {
        this.scene.tweens.add({
          targets: this.text,
          alpha: { from: 1, to: 0 },
          duration: 300,
          ease: Phaser.Math.Easing.Cubic.Out,
          onComplete: function () {
            text.destroy();
          },
        });
      },
      callbackScope: { scene: this.#scene, text: text },
    });
  }

  #handleDeath() {
    this.#life = this.#totalLife;
    // this.gameObject.destroy();
  }

  #createPrimaryAttack(
    position: GamePosition,
    direction: Phaser.Math.Vector2,
    callback?: (sprite: Phaser.Physics.Arcade.Sprite) => void
  ) {
    const attack = new this.#moveset.primary({
      scene: this.#scene,
      position,
      direction: direction,
      originId: this.id,
      status: this.#status,
      callback,
    });

    this.#attacks.add(attack);
  }

  primaryAttack(timer: number, direction: Phaser.Math.Vector2) {
    const isCooldown = this.#cooldown.get(ColldownEnum.PRIMARY_ATTACK);
    if (isCooldown) return;

    const attackPosition = new Phaser.Math.Vector2(
      this.gameObject.body.x + this.gameObject.body.width / 2,
      this.gameObject.body.y + this.gameObject.body.height / 2
    );
    attackPosition.add(
      new Phaser.Math.Vector2(
        direction.x * this.gameObject.body.width,
        direction.y * this.gameObject.body.height
      )
    );

    this.freeze = true;
    this.#cooldown.set(ColldownEnum.PRIMARY_ATTACK, timer);
    this.#createPrimaryAttack(attackPosition, direction, (_sprite) => {
      this.freeze = false;
    });
  }

  dash(timer: number, directions: ControllerKeysEnum[]) {
    if (
      !directions.includes(ControllerKeysEnum.SHIFT) ||
      !directions.some((direction) =>
        [
          ControllerKeysEnum.A,
          ControllerKeysEnum.D,
          ControllerKeysEnum.S,
          ControllerKeysEnum.W,
        ].includes(direction)
      )
    )
      return;

    const isCooldown = this.#cooldown.get(ColldownEnum.DASH);
    if (isCooldown) return;

    this.#cooldown.set(ColldownEnum.DASH, timer);
    this.freeze = true;
    if (directions.includes(ControllerKeysEnum.A)) {
      this.#scene.tweens.add({
        targets: { velocity: 0 },
        velocity: -300,
        duration: 200,
        ease: Phaser.Math.Easing.Cubic.Out,
        onUpdate: (_tween, target) => {
          this.gameObject.body.setVelocityX(target.velocity);
        },
        onComplete: () => {
          this.freeze = false;
        },
        callbackScope: this,
      });
    } else if (directions.includes(ControllerKeysEnum.D)) {
      this.#scene.tweens.add({
        targets: { velocity: 0 },
        velocity: 300,
        duration: 200,
        ease: Phaser.Math.Easing.Cubic.Out,
        onUpdate: (_tween, target) => {
          this.gameObject.body.setVelocityX(target.velocity);
        },
        onComplete: () => {
          this.freeze = false;
        },
        callbackScope: this,
      });
    } else if (directions.includes(ControllerKeysEnum.W)) {
      this.#scene.tweens.add({
        targets: { velocity: 0 },
        velocity: -300,
        duration: 200,
        ease: Phaser.Math.Easing.Cubic.Out,
        onUpdate: (_tween, target) => {
          this.gameObject.body.setVelocityY(target.velocity);
        },
        onComplete: () => {
          this.freeze = false;
        },
        callbackScope: this,
      });
    } else if (directions.includes(ControllerKeysEnum.S)) {
      this.#scene.tweens.add({
        targets: { velocity: 0 },
        velocity: 300,
        duration: 200,
        ease: Phaser.Math.Easing.Cubic.Out,
        onUpdate: (_tween, target) => {
          this.gameObject.body.setVelocityY(target.velocity);
        },
        onComplete: () => {
          this.freeze = false;
        },
        callbackScope: this,
      });
    }
  }

  handleCooldown(timer: number) {
    for (const [key, timeOfSkillUsed] of this.#cooldown.entries()) {
      const cooldown = COOLDOWN_MAPPER[key];
      if (timer && timer >= timeOfSkillUsed + cooldown) {
        this.#cooldown.delete(key);
      }
    }
  }
}
