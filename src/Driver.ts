import { Result, processAndGetConjugation } from "./Conjugation/Conjugation";
import { VerbInfo } from "./Conjugation/VerbDefs";
import { FormInfo, FormName } from "./Conjugation/VerbFormDefs";

export const conjugateVerb = (verbInfo: VerbInfo, formInfo: FormInfo): Result | Error => {
  return processAndGetConjugation(verbInfo, formInfo);
}