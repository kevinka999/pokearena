import Phaser from "phaser";
import { PreloadScene, BattleScene, SelectionScene, HudScene } from "./scenes";
import { GlobalPlugin } from "./plugin/GlobalPlugin";

declare module "phaser" {
  interface Scene {
    global: GlobalPlugin;
  }
}

const game = new Phaser.Game({
  type: Phaser.CANVAS,
  pixelArt: true,
  antialias: false,
  autoRound: false,
  roundPixels: false,
  scale: {
    parent: "main-container",
    width: 1920,
    height: 1080,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: true,
    },
  },
  backgroundColor: "#000000",
  plugins: {
    global: [
      {
        key: "GlobalPlugin",
        plugin: GlobalPlugin,
        start: true,
        mapping: "global",
      },
    ],
  },
  scene: [PreloadScene, SelectionScene, BattleScene, HudScene],
});
