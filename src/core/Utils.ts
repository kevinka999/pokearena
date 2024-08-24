import { GamePosition, PokemonTypes } from "../types/game";
import { ControllerKeysEnum } from "./Controller";

export class Utils {
  static getVectorDirection(
    positionA: GamePosition,
    positionB: GamePosition
  ): Phaser.Math.Vector2 {
    let direction = new Phaser.Math.Vector2(
      positionA.x - positionB.x,
      positionA.y - positionB.y
    );
    direction.normalize();
    return direction;
  }

  static getVectorFromControllerDirection(
    direction: ControllerKeysEnum
  ): Phaser.Math.Vector2 {
    switch (direction) {
      case ControllerKeysEnum.A:
        return new Phaser.Math.Vector2(-1, 0);
      case ControllerKeysEnum.D:
        return new Phaser.Math.Vector2(1, 0);
      case ControllerKeysEnum.W:
        return new Phaser.Math.Vector2(0, -1);
      case ControllerKeysEnum.S:
        return new Phaser.Math.Vector2(0, 1);
      default:
        throw new Error("Direction not defined");
    }
  }

  static getAngleDegressFromDirection(vector: Phaser.Math.Vector2): number {
    const pointerAngle = Math.atan2(vector.y, vector.x);
    return Math.round((Phaser.Math.RadToDeg(pointerAngle) + 360) % 360);
  }

  static getControllerDirectionFromVector(
    vector: Phaser.Math.Vector2
  ): ControllerKeysEnum {
    const angleInDegrees = this.getAngleDegressFromDirection(vector);
    if (angleInDegrees >= 315 || angleInDegrees <= 45) {
      return ControllerKeysEnum.D;
    } else if (angleInDegrees >= 46 && angleInDegrees <= 135) {
      return ControllerKeysEnum.S;
    } else if (angleInDegrees >= 136 && angleInDegrees <= 225) {
      return ControllerKeysEnum.A;
    } else if (angleInDegrees >= 226 && angleInDegrees <= 314) {
      return ControllerKeysEnum.W;
    }

    throw new Error("Angle not defined");
  }

  static getRadiansFromDirection(
    direction: ControllerKeysEnum
  ): number | undefined {
    switch (direction) {
      case ControllerKeysEnum.A:
        return 0;
      case ControllerKeysEnum.D:
        return 3.142;
      case ControllerKeysEnum.W:
        return 1.571;
      case ControllerKeysEnum.S:
        return 4.712;
      default:
        return undefined;
    }
  }

  static getBackgroundColorFromTypes(pokeType: PokemonTypes[] | PokemonTypes) {
    const type = Array.isArray(pokeType) ? pokeType[0] : pokeType;
    switch (type) {
      case PokemonTypes.FIRE:
        return 0xf56642;
      case PokemonTypes.GRASS:
        return 0x76c765;
      case PokemonTypes.WATER:
        return 0x5a9fd1;
      default:
        return 0x60665f;
    }
  }
}
