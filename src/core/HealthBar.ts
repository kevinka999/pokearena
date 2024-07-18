type HealthBarParams = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  initialLife: number;
  totalLife: number;
};

export class HealthBar extends Phaser.GameObjects.Container {
  #scene: Phaser.Scene;
  #width!: number;
  #totalLife!: number;
  #life!: number;
  #currentLife!: number;
  #health!: Phaser.GameObjects.Rectangle;
  #tween?: Phaser.Tweens.Tween;

  constructor(params: HealthBarParams) {
    super(params.scene, 0, 0, []);

    this.#scene = params.scene;
    this.#width = params.width;
    this.#totalLife = params.totalLife;
    this.#life = params.initialLife;
    this.#currentLife = params.initialLife;

    const container = new Phaser.GameObjects.Rectangle(
      params.scene,
      params.x,
      params.y,
      params.width,
      params.height,
      0x00000
    ).setOrigin(0);

    this.#health = new Phaser.GameObjects.Rectangle(
      params.scene,
      params.x,
      params.y,
      (this.#width * this.#getLifePercentageInNumber()) / 100,
      params.height,
      0x23ad49
    ).setOrigin(0);

    this.add(container);
    this.add(this.#health);
  }

  get currentLife() {
    return this.#currentLife;
  }

  set currentLife(value: number) {
    this.#currentLife = value;
  }

  setLife(life: number) {
    if (this.#life === life) return;

    this.#life = life;

    if (this.#tween) this.#tween.destroy();
    this.#tween = this.#scene.tweens.add({
      targets: this,
      currentLife: life,
      ease: Phaser.Math.Easing.Cubic.Out,
      onUpdate: () => {
        this.#health.width =
          (this.#width * this.#getLifePercentageInNumber()) / 100;
      },
      duration: 500,
    });
  }

  #getLifePercentageInNumber() {
    return Math.trunc((this.#currentLife / this.#totalLife) * 100);
  }
}
