import Phaser from "phaser";
import { PreloadScene, BattleScene, SelectionScene } from "./scenes";
import { GlobalPlugin } from "./plugin/GlobalPlugin";

declare module "phaser" {
  interface Scene {
    global: GlobalPlugin;
  }
}

const game = new Phaser.Game({
  type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    parent: "main-container",
    width: 320,
    height: 180,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
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
  scene: [SelectionScene, PreloadScene, BattleScene],
});
