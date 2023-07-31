import { processAndGetConjugation } from "./Process/Process";
import { VerbInfo, FormInfo, Result } from "./typedefs"
export { VerbInfo, VerbType, FormInfo, FormName, AuxiliaryFormName, AdditionalFormName, Result } from "./typedefs"

export function getVerbConjugation(verbInfo: VerbInfo, formInfo: FormInfo): Result | Error {
  return processAndGetConjugation(verbInfo, formInfo);
}