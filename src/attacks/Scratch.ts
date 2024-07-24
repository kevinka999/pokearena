import { Attack, AttackBaseParams } from "../core/Attack";
import { AttacksKeysEnums, AttackTypesEnum } from "../types/keys";

export class Scratch extends Attack {
  constructor(params: AttackBaseParams) {
    super({
      ...params,
      damage: 40,
      spriteKey: [
        AttacksKeysEnums.SCRATCH_1,
        AttacksKeysEnums.SCRATCH_2,
        AttacksKeysEnums.SCRATCH_3,
        AttacksKeysEnums.SCRATCH_4,
        AttacksKeysEnums.SCRATCH_5,
      ],
      type: AttackTypesEnum.PHYSICAL,
    });
  }
}
