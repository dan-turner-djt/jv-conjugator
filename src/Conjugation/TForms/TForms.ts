import { ConjugationResult } from "../Conjugation";
import { VerbType } from "../../typedefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { getStems, getTStem } from "../Stems/Stems";

//teForm: true = teForm, false = taForm
export function getTForm(verbInfo: ProcessedVerbInfo, teForm: boolean): ConjugationResult | Error {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Iku) {
      return {suffix: teForm? "って" : "った"};
    }
    if (verbInfo.irregular === VerbType.Tou) {
      return {suffix: teForm? "うて" : "うた"};
    }
    if (verbInfo.irregular === VerbType.Suru || verbInfo.irregular === VerbType.Kuru) {
      const stemInfo: ConjugationResult | Error = getStems(verbInfo, 1);
      if (stemInfo instanceof Error) return stemInfo;
      return {...stemInfo, suffix: stemInfo.suffix + (teForm? "て" : "た")};
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return {suffix: getTStem(verbInfo.endingChar) + (teForm? teEndings[verbInfo.endingChar] : taEndings[verbInfo.endingChar])};
  }
  return {suffix: teForm? "て" : "た"};
}

const teEndings: { [index: string]: string } = {
  う: "て", く: "て", ぐ: "で", す: "て", つ: "て", ぬ: "で", ぶ: "で", む: "で", る: "て"
}

const taEndings: { [index: string]: string } = {
  う: "た", く: "た", ぐ: "だ", す: "た", つ: "た", ぬ: "だ", ぶ: "だ", む: "だ", る: "た"
}