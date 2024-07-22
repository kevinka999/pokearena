import { GamePosition } from "../types/game";
import { Pokemon } from "./Pokemon";
import { Utils } from "./Utils";

export class Bot {
  #pokemon: Pokemon;
  #attackInterval: number = 3000;
  #previousAttackInterval: number = 0;

  constructor(pokemon: Pokemon) {
    this.#pokemon = pokemon;
  }

  get pokemon() {
    return this.#pokemon;
  }

  handleAttack(target: GamePosition, timer: number) {
    const vector = Utils.getVector(
      { x: target.x, y: target.y },
      { x: this.#pokemon.gameObject.x, y: this.#pokemon.gameObject.y }
    );
    const targetDirection = Utils.getDirectionFromVector(vector);

    if (timer > this.#previousAttackInterval + this.#attackInterval) {
      this.#previousAttackInterval = timer;
      this.pokemon.primaryAttack(targetDirection);
    }
  }

  handleMovement(target: GamePosition) {
    const vector = Utils.getVector(
      { x: target.x, y: target.y },
      { x: this.#pokemon.gameObject.x, y: this.#pokemon.gameObject.y }
    );
    const walkingDirection = Utils.getDirectionFromVector(vector);
    this.#pokemon.movePlayer([walkingDirection], walkingDirection);
  }
}
