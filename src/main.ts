import Phaser from "phaser";
import { PreloadScene, BattleScene } from "./scenes";

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
  scene: [PreloadScene, BattleScene],
});
