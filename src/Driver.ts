import { VerbInfo } from "./Defs/VerbDefs";
import { FormInfo } from "./Defs/VerbFormDefs";
import { Result, processAndGetConjugation } from "./Process/Process";

export function conjugateVerb(verbInfo: VerbInfo, formInfo: FormInfo): Result | Error {
  return processAndGetConjugation(verbInfo, formInfo);
}