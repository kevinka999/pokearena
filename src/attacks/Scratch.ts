import { Attack, AttackBaseParams, AttackTypesEnum } from "../core/Attack";
import { AttacksKeysEnums } from "../types/keys";

export class Scratch extends Attack {
  constructor(params: AttackBaseParams) {
    super({
      ...params,
      damage: 40,
      spriteKey: AttacksKeysEnums.SCRATCH,
      type: AttackTypesEnum.PHYSICAL,
    });
  }
}
