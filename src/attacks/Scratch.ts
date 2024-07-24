import { Attack, AttackBaseParams } from "../core/Attack";
import { AttacksKeysEnums, AttackTypesEnum } from "../types/keys";

export class Scratch extends Attack {
  constructor(params: AttackBaseParams) {
    super({
      ...params,
      damage: 40,
      spriteKey: AttacksKeysEnums.SCRATCH_1,
      type: AttackTypesEnum.PHYSICAL,
    });
  }
}
