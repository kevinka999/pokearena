import { Pokemon } from "./Pokemon";

export class Bot {
  #pokemon: Pokemon;

  constructor(pokemon: Pokemon) {
    this.#pokemon = pokemon;
  }

  get pokemon() {
    return this.#pokemon;
  }
}
