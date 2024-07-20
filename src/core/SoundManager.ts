import { SFXKeysEnums } from "../types/keys";

export class SoundManager {
  #sounds!: Map<SFXKeysEnums, Phaser.Sound.BaseSound>;

  preload(scene: Phaser.Scene): void {
    scene.load.audio(SFXKeysEnums.SELECT, "sfx/select.wav");
    scene.load.audio(SFXKeysEnums.CONFIRM, "sfx/confirm.wav");
  }

  create(scene: Phaser.Scene): void {
    this.#sounds = new Map();

    this.#sounds.set(SFXKeysEnums.SELECT, scene.sound.add(SFXKeysEnums.SELECT));
    this.#sounds.set(
      SFXKeysEnums.CONFIRM,
      scene.sound.add(SFXKeysEnums.CONFIRM)
    );
  }

  play(key: SFXKeysEnums): void {
    const sound = this.#sounds.get(key);
    if (sound) {
      sound.play();
    } else {
      console.warn(`Sound ${sound} does not exist.`);
    }
  }
}
