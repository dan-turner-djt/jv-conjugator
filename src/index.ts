import { processAndGetConjugation, processAndGetConjugations } from "./Process/Process";
import { VerbInfo, FormInfo, Result } from "./typedefs"
export { VerbInfo, VerbType, FormInfo, FormName, AuxiliaryFormName, AdditionalFormName, Result } from "./typedefs"

export function getVerbConjugation(verbInfo: VerbInfo, formInfo: FormInfo): Result | Error {
  return processAndGetConjugation(verbInfo, formInfo);
}

export function getVerbConjugations(verbInfo: VerbInfo, formInfo: FormInfo[]): (Result | Error)[] | Error {
  return processAndGetConjugations(verbInfo, formInfo);
}