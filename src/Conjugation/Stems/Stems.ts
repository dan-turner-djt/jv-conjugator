import { ErrorMessages } from "../../Defs/ErrorMessages";
import { VerbType } from "../../typedefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { kuruStems, stems, suruStems, tStems } from "./StemDefs";

export function getStems(verbInfo: ProcessedVerbInfo, stemIndex: number): ConjugationResult | Error {
  if (stemIndex < 0 || stemIndex > 3) {
    return new Error(ErrorMessages.InvalidIndex);
  }

  if (verbInfo.irregular !== false) {
    if (stemIndex === 1 &&
    (  verbInfo.irregular === VerbType.Irassharu
    || verbInfo.irregular === VerbType.Ossharu
    || verbInfo.irregular === VerbType.Kudasaru
    || verbInfo.irregular === VerbType.Gozaru
    || verbInfo.irregular === VerbType.Nasaru)) {
      return {suffix: "い"};
    }

    if (verbInfo.irregular === VerbType.Suru) {
      return {suffix: "", newKanaRawStem: suruStems[stemIndex]};
    }

    if (verbInfo.irregular === VerbType.Kuru) {
      return {suffix: "", newKanaRawStem: kuruStems[stemIndex]};
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return {suffix: stems[verbInfo.endingChar][stemIndex]};
  }
  return {suffix: ""};
}

export function getTStem(endingChar: string): string {
  return tStems[endingChar];
}

export function checkVerbEndingIsValid(endingChar: string): boolean {
  return Object.prototype.hasOwnProperty.call(stems, endingChar);
}