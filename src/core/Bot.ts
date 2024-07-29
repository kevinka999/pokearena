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
    const vector = Utils.getVectorDirection(
      { x: target.x, y: target.y },
      { x: this.#pokemon.gameObject.x, y: this.#pokemon.gameObject.y }
    );

    if (timer > this.#previousAttackInterval + this.#attackInterval) {
      this.#previousAttackInterval = timer;
      this.pokemon.primaryAttack(timer, vector);
    }
  }

  handleMovement(target: GamePosition) {
    const vector = Utils.getVectorDirection(
      { x: target.x, y: target.y },
      { x: this.#pokemon.gameObject.x, y: this.#pokemon.gameObject.y }
    );
    const walkingDirection = Utils.getControllerDirectionFromVector(vector);
    this.#pokemon.movePlayer([walkingDirection], walkingDirection);
  }
}
