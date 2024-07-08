import { Attack, AttackBaseParams, AttackTypesEnum } from "../core/Attack";
import { AttacksKeysEnums } from "../types/keys";

export class RazorLeaf extends Attack {
  constructor(params: AttackBaseParams) {
    super({
      scene: params.scene,
      gameObject: params.gameObject,
      damage: 200,
      spriteKey: AttacksKeysEnums.RAZOR_LEAF,
      type: AttackTypesEnum.MELEE,
    });
  }
}
