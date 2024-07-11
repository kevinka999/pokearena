import { GamePosition } from "../types/game";
import { PokemonKeysEnums, SceneKeysEnums } from "../types/keys";

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

export class SelectionScene extends Phaser.Scene {
  #characters: Phaser.GameObjects.Container[] = [];

  constructor() {
    super({
      key: SceneKeysEnums.SELECTION,
      active: true,
    });
  }

  preload() {
    this.load.spritesheet(
      `${PokemonKeysEnums.BULBASAUR}_SELECTION`,
      `/assets/pokemon/selection/${PokemonKeysEnums.BULBASAUR.toLowerCase()}.png`,
      {
        frameWidth: 36,
        frameHeight: 36,
      }
    );
  }

  create() {
    this.anims.create({
      key: `${PokemonKeysEnums.BULBASAUR}_SELECTION_ANIM`,
      frames: this.anims.generateFrameNumbers(
        `${PokemonKeysEnums.BULBASAUR}_SELECTION`
      ),
      repeat: -1,
      frameRate: 10,
    });

    this.#renderAllPokemonOptions();
  }

  update() {}

  #renderAllPokemonOptions() {
    const rows = 3;
    const margin = 10;
    const qtyOptionsPerRow = Math.floor(options.length / rows);

    const canvasWidth = this.scale.width;
    const canvasHeight = this.scale.height;

    const widthForEach =
      (canvasWidth - (qtyOptionsPerRow + 1) * margin) / qtyOptionsPerRow;
    const heightForEach = (canvasHeight - (rows + 1) * margin) / rows;

    let x = margin;
    let y = margin;
    let rowsRendered = 1;
    options.forEach((pokemonKey, idx) => {
      this.#addPokemonContainer(
        { x, y },
        widthForEach,
        heightForEach,
        pokemonKey
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
    position: GamePosition,
    width: number,
    height: number,
    key: PokemonKeysEnums
  ) {
    const frame = new Phaser.GameObjects.Rectangle(
      this,
      0,
      0,
      width,
      height,
      0xffffff
    ).setOrigin(0);

    const sprite = new Phaser.GameObjects.Sprite(
      this,
      frame.width / 2,
      frame.height / 2,
      "foo",
      0
    )
      .setOrigin(0.5)
      .setScale(2);
    sprite.play(`${PokemonKeysEnums.BULBASAUR}_SELECTION_ANIM`);

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

    this.#characters.push(
      this.add.container(position.x, position.y, [frame, sprite, overlay])
    );
  }
}
