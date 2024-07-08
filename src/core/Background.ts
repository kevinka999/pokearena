import { MapKeysEnums } from "../types/keys";

export type BackgroundParams = {
  scene: Phaser.Scene;
};

enum LayersEnum {
  BACKGROUND = "background",
  FOREGROUND = "foreground",
  COLLISION = "collision",
  ASSUMPTION = "assumption",
}

export class Background {
  #scene: Phaser.Scene;
  #tilemap!: Phaser.Tilemaps.Tilemap;
  #tileset!: Phaser.Tilemaps.Tileset;
  #layers!: { [key in LayersEnum]: Phaser.Tilemaps.TilemapLayer };

  constructor(params: BackgroundParams) {
    this.#scene = params.scene;
    this.#createLayers();
    this.#configLayers();
    this.#setBounds();
  }

  get displayWidth() {
    const background = this.#layers[LayersEnum.BACKGROUND];
    return background.displayWidth;
  }

  get displayHeight() {
    const background = this.#layers[LayersEnum.BACKGROUND];
    return background.displayHeight;
  }

  addCollider(gameObject: any) {
    this.#scene.physics.add.collider(
      gameObject,
      this.#layers[LayersEnum.COLLISION]
    );
  }

  #createLayers() {
    this.#tilemap = this.#scene.make.tilemap({
      key: MapKeysEnums.MAPCONFIG,
    });

    const tileset = this.#tilemap.addTilesetImage(
      "tileset",
      MapKeysEnums.TILESET
    );
    if (!tileset) throw new Error("Tileset not loaded");
    this.#tileset = tileset;

    const background = this.#tilemap.createLayer(
      LayersEnum.BACKGROUND,
      this.#tileset,
      0,
      0
    );
    const collision = this.#tilemap.createLayer(
      LayersEnum.COLLISION,
      this.#tileset,
      0,
      0
    );
    const assumption = this.#tilemap.createLayer(
      LayersEnum.ASSUMPTION,
      this.#tileset,
      0,
      0
    );
    const foreground = this.#tilemap.createLayer(
      LayersEnum.FOREGROUND,
      this.#tileset,
      0,
      0
    );

    if (!background || !collision || !assumption || !foreground)
      throw new Error("Layers not loaded");

    this.#layers = {
      [LayersEnum.BACKGROUND]: background,
      [LayersEnum.COLLISION]: collision,
      [LayersEnum.ASSUMPTION]: assumption,
      [LayersEnum.FOREGROUND]: foreground,
    };
  }

  #configLayers() {
    const collisionLayer = this.#layers[LayersEnum.COLLISION];
    collisionLayer.setCollisionByProperty({ collides: true });
    collisionLayer.setCollisionBetween(1, this.#tileset.total);

    const foreground = this.#layers[LayersEnum.FOREGROUND];
    foreground.setDepth(99);
  }

  #setBounds() {
    this.#scene.physics.world.setBounds(
      0,
      0,
      this.displayWidth,
      this.displayHeight
    );
  }
}
