import { GamePosition } from "../types/game";
import { ControllerKeysEnum } from "./Controller";

export class Utils {
  static getPointerDirectionInRelationTo(
    pointer: GamePosition,
    object: GamePosition
  ) {
    const pointerAngle = Math.atan2(pointer.y - object.y, pointer.x - object.x);
    const angleInDegrees = Math.round(
      (Phaser.Math.RadToDeg(pointerAngle) + 360) % 360
    );

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
}
