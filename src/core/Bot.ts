import { ControllerKeysEnum } from "./Controller";
import { Pokemon } from "./Pokemon";

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

  handleAttack(timer: number) {
    if (timer > this.#previousAttackInterval + this.#attackInterval) {
      this.#previousAttackInterval = timer;
      this.pokemon.primaryAttack(ControllerKeysEnum.A);
    }
  }
}
