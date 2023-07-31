import { VerbInfo } from "./Defs/VerbDefs";
import { FormInfo } from "./Defs/VerbFormDefs";
import { Result, processAndGetConjugation } from "./Process/Process";

export { VerbInfo } from "./Defs/VerbDefs";
export { FormInfo } from "./Defs/VerbFormDefs";
export { Result } from "./Process/Process";

export function getVerbConjugation(verbInfo: VerbInfo, formInfo: FormInfo): Result | Error {
  return processAndGetConjugation(verbInfo, formInfo);
}