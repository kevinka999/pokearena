import { Controller, ControllerKeysEnum } from "../core";
import { GamePosition } from "../types/game";
import { DataKeysEnums, PokemonKeysEnums, SceneKeysEnums } from "../types/keys";

type AnimationConfig = {
  key: PokemonKeysEnums;
  start: number;
  end: number;
  frameRate: number;
  originX?: number;
  originY?: number;
  scale?: number;
};

const options: PokemonKeysEnums[] = [
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

type CharacterSelection = {
  container: Phaser.GameObjects.Container;
  pokemonKey: PokemonKeysEnums;
  isSelected: boolean;
};

export class SelectionScene extends Phaser.Scene {
  #rows: number = 3;
  #characters!: Map<number, CharacterSelection>;
  #selectedIndex!: number;
  #previousIndex?: number;
  #frame!: { width: number; height: number };
  #controller!: Controller;

  constructor() {
    super({
      key: SceneKeysEnums.SELECTION,
      active: true,
    });

    this.#characters = new Map<number, CharacterSelection>();
    this.#selectedIndex = 0;
  }

  preload() {
    options.forEach((pokemonKey) => {
      this.load.atlas(
        `${pokemonKey.toUpperCase()}_SELECTION`,
        `/assets/pokemon/selection/${pokemonKey.toLowerCase()}.png`,
        `/assets/pokemon/selection/${pokemonKey.toLowerCase()}.json`
      );
    });

    this.load.json(
      DataKeysEnums.POKEMON_SELECTION_ANIMATIONS,
      "/data/pokemon_selection_animations.json"
    );
  }

  create() {
    this.#controller = new Controller({ scene: this });

    const animations: AnimationConfig[] = this.cache.json.get(
      DataKeysEnums.POKEMON_SELECTION_ANIMATIONS
    );

    this.#createAnimations(animations);
    this.#renderAllPokemonOptions(animations);
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

  #createAnimations(animations: AnimationConfig[]) {
    animations.forEach((animation) => {
      this.anims.create({
        key: `${animation.key.toUpperCase()}_SELECTION_ANIM`,
        frames: this.anims.generateFrameNames(
          `${animation.key.toUpperCase()}_SELECTION`,
          {
            zeroPad: 4,
            suffix: ".png",
            start: animation.start,
            end: animation.end,
          }
        ),
        frameRate: animation.frameRate,
        repeat: -1,
      });
    });
  }

  #renderAllPokemonOptions(animations: AnimationConfig[]) {
    const margin = 10;
    const qtyOptionsPerRow = Math.floor(options.length / this.#rows);

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
    options.forEach((pokemonKey, idx) => {
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
        x = 10;
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
    const frame = new Phaser.GameObjects.Rectangle(
      this,
      0,
      0,
      this.#frame.width,
      this.#frame.height,
      0xffffff
    ).setOrigin(0);

    const sprite = new Phaser.GameObjects.Sprite(
      this,
      frame.width / 2,
      frame.height / 2,
      `${pokemon.key.toUpperCase()}_SELECTION`,
      "0001.png"
    )
      .setScale(pokemon.scale ?? 2)
      .setOrigin(pokemon.originX ?? 0.5, pokemon.originY ?? 0.5);

    const maskGraphics = this.make.graphics();
    maskGraphics.fillRect(
      position.x + 1,
      position.y + 1,
      frame.width - 2,
      frame.height - 2
    );
    const mask = maskGraphics.createGeometryMask();
    sprite.setMask(mask);

    const overlay = this.add.graphics();
    overlay
      .fillStyle(0x000000, 0.8)
      .fillRect(1, 1, frame.width - 2, frame.height - 2);

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
      .fillRect(1, 1, this.#frame.width - 2, this.#frame.height - 2);

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
      }
    );

    this.#controller.listenEventKeyboardDown(
      ControllerKeysEnum.W,
      (e: Phaser.Input.Keyboard.Key) => {
        const qtyOptionsPerRow = Math.floor(options.length / this.#rows);
        let nextCharacter = this.#selectedIndex - qtyOptionsPerRow;
        if (nextCharacter <= 0) {
          nextCharacter = 0;
        }

        this.#previousIndex = this.#selectedIndex;
        this.#selectedIndex = nextCharacter;
      }
    );

    this.#controller.listenEventKeyboardDown(
      ControllerKeysEnum.S,
      (e: Phaser.Input.Keyboard.Key) => {
        const qtyOptionsPerRow = Math.floor(options.length / this.#rows);
        const lastPosition = this.#characters.size;
        let nextCharacter = this.#selectedIndex + qtyOptionsPerRow;
        if (nextCharacter >= lastPosition) {
          nextCharacter = lastPosition - 1;
        }

        this.#previousIndex = this.#selectedIndex;
        this.#selectedIndex = nextCharacter;
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
          this.scene.switch(SceneKeysEnums.PRELOAD);
        }
      }
    );
  }
}
