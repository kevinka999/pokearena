import { AttackTypesEnum, PokemonStatus } from "../types/keys";

export class GameMechanicUtils {
  static getStatusFromLevel(level: number, ivs: PokemonStatus): PokemonStatus {
    return {
      HP: ivs.HP * (level * 10),
      ATTACK: ivs.ATTACK * level,
      SP_ATTACK: ivs.SP_ATTACK * level,
      DEFENSE: ivs.DEFENSE * level,
      SP_DEFENSE: ivs.SP_DEFENSE * level,
      SPEED: ivs.SPEED * level,
    };
  }

  static getAttackDamage(
    baseDamage: number,
    type: AttackTypesEnum,
    status: PokemonStatus
  ): number {
    const statusToUse =
      type === AttackTypesEnum.PHYSICAL ? status.ATTACK : status.SP_ATTACK;
    return Math.round(baseDamage * (statusToUse / 100));
  }

  static getLifePercentage(current: number, totalLife: number) {
    return (current / totalLife) * 100;
  }
}
