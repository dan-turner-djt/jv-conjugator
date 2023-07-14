import { Result, processAndGetConjugation } from "./Conjugation/Conjugation";
import { VerbInfo } from "./Conjugation/VerbDefs";
import { FormName } from "./Conjugation/VerbFormDefs";

export const getConjugation = (verbInfo: VerbInfo, form: FormName[]): Result => {
  return processAndGetConjugation(verbInfo, form[0]);
}