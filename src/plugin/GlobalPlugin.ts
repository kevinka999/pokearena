import { Pokemon } from "../core";
import {
  Bulbasaur,
  Charmander,
  Squirtle,
  Chikorita,
  Cyndaquil,
  Totodile,
  Treecko,
  Torchic,
  Mudkip,
  Turtwig,
  Chimchar,
  Piplup,
} from "../pokemons";
import { IPlayerPokemon } from "../types/game";
import { PokemonKeysEnums } from "../types/keys";

const classMap: { [key in PokemonKeysEnums]?: any } = {
  [PokemonKeysEnums.BULBASAUR]: Bulbasaur,
  [PokemonKeysEnums.CHARMANDER]: Charmander,
  [PokemonKeysEnums.SQUIRTLE]: Squirtle,
  [PokemonKeysEnums.CHIKORITA]: Chikorita,
  [PokemonKeysEnums.CYNDAQUIL]: Cyndaquil,
  [PokemonKeysEnums.TOTODILE]: Totodile,
  [PokemonKeysEnums.TREECKO]: Treecko,
  [PokemonKeysEnums.TORCHIC]: Torchic,
  [PokemonKeysEnums.MUDKIP]: Mudkip,
  [PokemonKeysEnums.TURTWIG]: Turtwig,
  [PokemonKeysEnums.CHIMCHAR]: Chimchar,
  [PokemonKeysEnums.PIPLUP]: Piplup,
};

export class GlobalPlugin extends Phaser.Plugins.BasePlugin {
  #selectCharacter?: PokemonKeysEnums;

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
  }

  get selectCharacter(): PokemonKeysEnums | undefined {
    return this.#selectCharacter;
  }

  set selectCharacter(character: PokemonKeysEnums) {
    this.#selectCharacter = character;
  }

  getSelectedPokemonClass(): IPlayerPokemon {
    if (!this.#selectCharacter) throw new Error("Pokemon not selected");
    const intanceOfPokemon = classMap[this.#selectCharacter];
    if (!intanceOfPokemon) throw new Error("Instance not found");
    return intanceOfPokemon;
  }
}