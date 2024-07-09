import { DirectionsEnum } from "../core";
import { GamePosition } from "../types/game";

export function getPointerDirectionInRelationTo(
  pointer: GamePosition,
  object: GamePosition
) {
  const pointerDirectionInGameObjectRelation = Math.trunc(
    Math.atan2(pointer.y - object.y, pointer.x - object.x)
  );

  let direction: DirectionsEnum = DirectionsEnum.DOWN;
  if (
    Object.is(pointerDirectionInGameObjectRelation, -0) ||
    pointerDirectionInGameObjectRelation === -2 ||
    pointerDirectionInGameObjectRelation === -1
  ) {
    direction = DirectionsEnum.UP;
  } else if (pointerDirectionInGameObjectRelation === 0) {
    direction = DirectionsEnum.RIGHT;
  } else if (pointerDirectionInGameObjectRelation === 1) {
    direction = DirectionsEnum.DOWN;
  } else if (
    pointerDirectionInGameObjectRelation === -3 ||
    pointerDirectionInGameObjectRelation === 2 ||
    pointerDirectionInGameObjectRelation === 3
  ) {
    direction = DirectionsEnum.LEFT;
  }

  return direction;
}
