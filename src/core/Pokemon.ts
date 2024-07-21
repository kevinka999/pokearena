import {
  Damage,
  GamePosition,
  IPokemonAttack,
  PokemonTypes,
} from "../types/game";
import { ControllerKeysEnum } from "./Controller";
import { Player, PlayerParams } from "./Player";

export type PokemonIvs = {
  HP: number;
  ATTACK: number;
  SP_ATTACK: number;
  DEFENSE: number;
  SP_DEFENSE: number;
  SPEED: number;
};

type Moveset = {
  primary: IPokemonAttack;
  secondary: IPokemonAttack;
};

export type PokemonBaseParams = {
  level: number;
  baseStatus: PokemonIvs;
  type: PokemonTypes[];
  moveset: Moveset;
};

export class Pokemon extends Player {
  #scene: Phaser.Scene;
  #level!: number;
  #baseStatus!: PokemonIvs;
  #type!: PokemonTypes[];
  #moveset!: Moveset;
  #attacks: Phaser.Physics.Arcade.Group;
  #totalLife!: number;
  #life!: number;
  damages: Damage[] = [];

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
    this.#baseStatus = pokemonParams.baseStatus;
    this.#type = pokemonParams.type;
    this.#moveset = pokemonParams.moveset;
    this.#attacks = this.#scene.physics.add.group();

    this.#totalLife = 100;
    this.#life = 100;

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

  #configureEvents() {
    this.#scene.global.events.on(`damage_${this.id}`, this.#handleDamage, this);
  }

  #handleDamage(damage: Damage) {
    const isFromSameOrigin = damage.originId === this.id;
    if (isFromSameOrigin) return;

    const index = this.damages.findIndex((dmg) => dmg.id === damage.id);
    console.log(index);
    if (index !== -1) return;

    this.damages.push(damage);
    const newLife = (this.#life -= damage.damage);
    this.#life = newLife >= 0 ? newLife : 0;
    if (this.#life === 0) this.#handleDeath();
  }

  #handleDeath() {
    this.gameObject.destroy();
  }

  #createPrimaryAttack(
    position: GamePosition,
    callback?: (sprite: Phaser.Physics.Arcade.Sprite) => void
  ) {
    if (this.#attacks?.getLength() > 0) return;

    const attack = new this.#moveset.primary({
      scene: this.#scene,
      position,
      direction: this.lookDirection,
      originId: this.id,
      callback,
    });

    this.#attacks.add(attack);
  }

  primaryAttack(direction: ControllerKeysEnum) {
    this.freeze = true;

    let attackPosition: GamePosition = {
      x: this.gameObject.body.x + this.gameObject.body.width / 2,
      y: this.gameObject.body.y + this.gameObject.body.height / 2,
    };

    switch (direction) {
      case ControllerKeysEnum.W:
        attackPosition.y -= this.gameObject.body.height;
        break;
      case ControllerKeysEnum.D:
        attackPosition.x += this.gameObject.body.width;
        break;
      case ControllerKeysEnum.A:
        attackPosition.x -= this.gameObject.body.width;
        break;
      case ControllerKeysEnum.S:
        attackPosition.y += this.gameObject.body.height;
        break;
    }

    this.#createPrimaryAttack(attackPosition, (_sprite) => {
      this.freeze = false;
    });
  }
}
