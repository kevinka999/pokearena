import { SpriteGameObject } from "../types/game";
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

  addCollider(gameObject: SpriteGameObject) {
    this.#scene.physics.add.collider(
      gameObject,
      this.#layers[LayersEnum.COLLISION]
    );
  }

  turnOnDebugMode() {
    const debugGraphics = this.#scene.add.graphics().setAlpha(0.75);
    const collisionLayer = this.#layers[LayersEnum.COLLISION];
    collisionLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });
  }

  setSpawnPoint(gameObject: SpriteGameObject) {
    const spawnPoint = this.#tilemap.findObject(
      "objects",
      (obj) => obj.name === "spawn"
    );
    gameObject.setPosition(spawnPoint?.x, spawnPoint?.y);
  }

  #createLayers() {
    this.#tilemap = this.#scene.make.tilemap({
      key: MapKeysEnums.MAPCONFIG,
    });

    const tileset = this.#tilemap.addTilesetImage(
      "tileset",
      MapKeysEnums.TILESET,
      18,
      18
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
