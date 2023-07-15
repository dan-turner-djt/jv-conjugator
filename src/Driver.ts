import { Result, processAndGetConjugation } from "./Conjugation/Conjugation";
import { VerbInfo } from "./Conjugation/VerbDefs";
import { FormName } from "./Conjugation/VerbFormDefs";

export const conjugateVerb = (verbInfo: VerbInfo, form: FormName[]): Result | Error => {
  return processAndGetConjugation(verbInfo, form[0]);
}