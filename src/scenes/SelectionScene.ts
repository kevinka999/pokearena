import { Controller, ControllerKeysEnum } from "../core";
import { AnimationConfig, GamePosition } from "../types/game";
import {
  DataKeysEnums,
  PokemonKeysEnums,
  SceneKeysEnums,
  SFXKeysEnums,
} from "../types/keys";

type CharacterSelection = {
  container: Phaser.GameObjects.Container;
  pokemonKey: PokemonKeysEnums;
  isSelected: boolean;
};

export const selectionOptions: PokemonKeysEnums[] = [
  PokemonKeysEnums.BULBASAUR,
  PokemonKeysEnums.CHARMANDER,
  PokemonKeysEnums.SQUIRTLE,
  PokemonKeysEnums.CHIKORITA,
  PokemonKeysEnums.CYNDAQUIL,
  PokemonKeysEnums.TOTODILE,
  PokemonKeysEnums.TREECKO,
  PokemonKeysEnums.TORCHIC,
  PokemonKeysEnums.MUDKIP,
  PokemonKeysEnums.TURTWIG,
  PokemonKeysEnums.CHIMCHAR,
  PokemonKeysEnums.PIPLUP,
];

export class SelectionScene extends Phaser.Scene {
  #rows: number = 3;
  #characters!: Map<number, CharacterSelection>;
  #selectedIndex!: number;
  #previousIndex?: number;
  #frame!: { width: number; height: number };
  #controller!: Controller;
  #borderSize: number = 16;

  constructor() {
    super({
      key: SceneKeysEnums.SELECTION,
      active: false,
    });

    this.#characters = new Map<number, CharacterSelection>();
    this.#selectedIndex = 0;
  }

  create() {
    this.#controller = new Controller({ scene: this });

    this.#renderAllPokemonOptions();
    this.#handleChangeSelection();
    this.#handleSelectCharacter();
  }

  update() {
    const selectCharacter = this.#characters.get(this.#selectedIndex);
    if (selectCharacter !== undefined && !selectCharacter.isSelected) {
      this.#selectCharacter(this.#selectedIndex, selectCharacter);
      if (this.#previousIndex !== undefined) {
        const previousCharacter = this.#characters.get(this.#previousIndex);
        if (!previousCharacter) return;
        this.#deselectCharacter(this.#previousIndex, previousCharacter);
      }
    }
  }

  #renderAllPokemonOptions() {
    const animations: AnimationConfig<PokemonKeysEnums>[] = this.cache.json.get(
      DataKeysEnums.POKEMON_SELECTION_ANIMATIONS
    );

    const margin = 50;
    const qtyOptionsPerRow = Math.floor(selectionOptions.length / this.#rows);

    const canvasWidth = this.scale.width;
    const canvasHeight = this.scale.height;

    const widthForEach =
      (canvasWidth - (qtyOptionsPerRow + 1) * margin) / qtyOptionsPerRow;
    const heightForEach =
      (canvasHeight - (this.#rows + 1) * margin) / this.#rows;

    this.#frame = { width: widthForEach, height: heightForEach };

    let x = margin;
    let y = margin;
    let rowsRendered = 1;
    selectionOptions.forEach((pokemonKey, idx) => {
      const animationData = animations.find(
        (animation) => animation.key === pokemonKey.toLowerCase()
      );

      this.#addPokemonContainer(
        idx,
        {
          x,
          y,
        },
        {
          key: pokemonKey,
          originX: animationData?.originX,
          originY: animationData?.originY,
          scale: animationData?.scale,
        }
      );

      if ((idx + 1) / rowsRendered === qtyOptionsPerRow) {
        rowsRendered++;
        x = margin;
        y += heightForEach + margin;
      } else {
        x += widthForEach + margin;
      }
    });
  }

  #addPokemonContainer(
    index: number,
    position: GamePosition,
    pokemon: {
      key: PokemonKeysEnums;
      originX?: number;
      originY?: number;
      scale?: number;
    }
  ) {
    const frame = this.add.graphics();
    frame.fillStyle(0xffffff, 1.0);
    frame.fillRect(0, 0, this.#frame.width, this.#frame.height);

    const sprite = new Phaser.GameObjects.Sprite(
      this,
      this.#frame.width / 2,
      this.#frame.height / 2,
      `${pokemon.key.toUpperCase()}_SELECTION`,
      "0001.png"
    )
      .setScale((pokemon.scale ?? 2) * 6)
      .setOrigin(pokemon.originX ?? 0.5, pokemon.originY ?? 0.5);

    const maskGraphics = this.make.graphics();
    maskGraphics.fillRect(
      position.x + this.#borderSize / 2,
      position.y + this.#borderSize / 2,
      this.#frame.width - this.#borderSize,
      this.#frame.height - this.#borderSize
    );
    const mask = maskGraphics.createGeometryMask();
    sprite.setMask(mask);

    const overlay = this.add.graphics();
    overlay
      .fillStyle(0x000000, 0.8)
      .fillRect(
        this.#borderSize / 2,
        this.#borderSize / 2,
        this.#frame.width - this.#borderSize,
        this.#frame.height - this.#borderSize
      );

    this.#characters.set(index, {
      container: this.add.container(position.x, position.y, [
        frame,
        sprite,
        overlay,
      ]),
      pokemonKey: pokemon.key,
      isSelected: false,
    });
  }

  #selectCharacter(index: number, character: CharacterSelection) {
    const sprite = character.container.getAt(1) as Phaser.GameObjects.Sprite;
    sprite.play(`${character.pokemonKey.toUpperCase()}_SELECTION_ANIM`);

    const overlayToDestroy = character.container.getAt(2);
    character.container.remove(overlayToDestroy);
    overlayToDestroy.destroy();

    character.isSelected = true;
    this.#characters.set(index, character);
  }

  #deselectCharacter(index: number, character: CharacterSelection) {
    const sprite = character.container.getAt(1) as Phaser.GameObjects.Sprite;
    sprite.anims.stop();
    sprite.setFrame("0001.png");

    const overlay = this.add.graphics();
    overlay
      .fillStyle(0x000000, 0.8)
      .fillRect(
        this.#borderSize / 2,
        this.#borderSize / 2,
        this.#frame.width - this.#borderSize,
        this.#frame.height - this.#borderSize
      );

    character.isSelected = false;
    character.container.add(overlay);
    this.#characters.set(index, character);
  }

  #handleChangeSelection() {
    this.#controller.listenEventKeyboardDown(
      ControllerKeysEnum.A,
      (e: Phaser.Input.Keyboard.Key) => {
        let previousCharacterIndex = this.#selectedIndex - 1;
        if (previousCharacterIndex === -1) {
          const lastPosition = this.#characters.size;
          previousCharacterIndex = lastPosition - 1;
        }

        this.#previousIndex = this.#selectedIndex;
        this.#selectedIndex = previousCharacterIndex;
        this.global.soundManager.play(SFXKeysEnums.SELECT);
      }
    );

    this.#controller.listenEventKeyboardDown(
      ControllerKeysEnum.D,
      (e: Phaser.Input.Keyboard.Key) => {
        let nextCharacterIndex = this.#selectedIndex + 1;
        const lastPosition = this.#characters.size;
        if (nextCharacterIndex >= lastPosition) {
          nextCharacterIndex = 0;
        }

        this.#previousIndex = this.#selectedIndex;
        this.#selectedIndex = nextCharacterIndex;
        this.global.soundManager.play(SFXKeysEnums.SELECT);
      }
    );

    this.#controller.listenEventKeyboardDown(
      ControllerKeysEnum.W,
      (e: Phaser.Input.Keyboard.Key) => {
        const qtyOptionsPerRow = Math.floor(
          selectionOptions.length / this.#rows
        );
        let nextCharacter = this.#selectedIndex - qtyOptionsPerRow;
        if (nextCharacter <= 0) {
          nextCharacter = 0;
        }

        this.#previousIndex = this.#selectedIndex;
        this.#selectedIndex = nextCharacter;
        this.global.soundManager.play(SFXKeysEnums.SELECT);
      }
    );

    this.#controller.listenEventKeyboardDown(
      ControllerKeysEnum.S,
      (e: Phaser.Input.Keyboard.Key) => {
        const qtyOptionsPerRow = Math.floor(
          selectionOptions.length / this.#rows
        );
        const lastPosition = this.#characters.size;
        let nextCharacter = this.#selectedIndex + qtyOptionsPerRow;
        if (nextCharacter >= lastPosition) {
          nextCharacter = lastPosition - 1;
        }

        this.#previousIndex = this.#selectedIndex;
        this.#selectedIndex = nextCharacter;
        this.global.soundManager.play(SFXKeysEnums.SELECT);
      }
    );
  }

  #handleSelectCharacter() {
    this.#controller.listenEventKeyboardDown(
      ControllerKeysEnum.SPACE,
      (e: Phaser.Input.Keyboard.Key) => {
        const selectCharacter = this.#characters.get(this.#selectedIndex);
        if (selectCharacter !== undefined && selectCharacter.isSelected) {
          this.global.selectCharacter = selectCharacter.pokemonKey;

          this.global.soundManager.play(SFXKeysEnums.CONFIRM);
          this.scene.start(SceneKeysEnums.BATTLE);
          this.scene.remove();
        }
      }
    );
  }
}
