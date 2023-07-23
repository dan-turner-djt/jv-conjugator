import { ErrorMessages } from "../../Defs/ErrorMessages";
import { VerbType } from "../../Defs/VerbDefs";
import { AuxiliaryFormName } from "../../Defs/VerbFormDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { getStems } from "../Stems/Stems";

export function getAndProcessAuxForm(verbInfo: ProcessedVerbInfo, auxForm: AuxiliaryFormName, shortVer: boolean): ProcessedVerbInfo | Error {
  const auxFormResultObj: {result: ConjugationResult, nowSu?: boolean} | Error = getAuxForm(verbInfo, auxForm, shortVer);
  if (auxFormResultObj instanceof Error) {
    return auxFormResultObj;
  }

  const auxFormResult: ConjugationResult = auxFormResultObj.result;
  const becomesSuVerb: boolean = auxFormResultObj.nowSu;

  const newVerbInfo: ProcessedVerbInfo = {
    rawStem: {
      kana: verbInfo.rawStem.kana !== undefined? ((auxFormResult.newKanaRawStem? auxFormResult.newKanaRawStem : verbInfo.rawStem.kana) + auxFormResult.suffix) : undefined,
      kanji: verbInfo.rawStem.kanji !== undefined? ((auxFormResult.newKanjiRawStem? auxFormResult.newKanjiRawStem : verbInfo.rawStem.kanji) + auxFormResult.suffix) : undefined,
    },
    endingChar: becomesSuVerb? "す" : "る",
    type: becomesSuVerb? VerbType.Godan : VerbType.Ichidan,
    irregular: false
  }

  return newVerbInfo;
}


export function getAuxForm (verbInfo: ProcessedVerbInfo, auxForm: AuxiliaryFormName, shortVer: boolean): {result: ConjugationResult, nowSu?: boolean} | Error {
  let result: ConjugationResult | Error;
  switch (auxForm) {
    case AuxiliaryFormName.Potential:
      result = getPotentialForms(verbInfo, shortVer);
      if (result instanceof Error) return result;
      return {result: result};
    case AuxiliaryFormName.Passive:
      return getPassCausForms(verbInfo, PassCausForms.Pass, shortVer);
    case AuxiliaryFormName.Causative:
      return getPassCausForms(verbInfo, PassCausForms.Caus, shortVer);
    case AuxiliaryFormName.CausativePassive:
      return getPassCausForms(verbInfo, PassCausForms.CausPass, shortVer);
    default:
      return new Error(ErrorMessages.UnknownAuxFormName);
  }
}

function getPotentialForms(verbInfo: ProcessedVerbInfo, shortVer: boolean): ConjugationResult | Error {
  // Return without ending "る" so it doesn't have to be slice off again later

  if (verbInfo.irregular === VerbType.Suru) {
    return {suffix: "", newKanjiRawStem: "出来", newKanaRawStem: "でき"};
  }
  if (verbInfo.irregular === VerbType.Kuru) {
    const stem: ConjugationResult | Error = getStems(verbInfo, 3);
    if (stem instanceof Error) return stem;
    return {...stem, suffix: stem.suffix + (shortVer? "" : "ら") + "れ"};
  }

  if (verbInfo.type === VerbType.Godan) {
    const stem: ConjugationResult | Error = getStems(verbInfo, 2);
    if (stem instanceof Error) return stem;
    return {...stem, suffix: stem.suffix};
  }
  return {suffix: (shortVer? "" : "ら") + "れ"};
}

export enum PassCausForms {Pass, Caus, CausPass}
function getPassCausForms(verbInfo: ProcessedVerbInfo, formType: PassCausForms, shortVer: boolean): {result: ConjugationResult, nowSu?: boolean} | Error {
  // Return without ending "る" so it doesn't have to be slice off again later

  let fullStem: ConjugationResult | Error = {suffix: ""};
  let extraChar = true;
  let validCausPassShortVer = false;
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Suru) {
      fullStem = getStems(verbInfo, 0);
      extraChar = false;
    }
    if (verbInfo.irregular === VerbType.Kuru) {
      fullStem = getStems(verbInfo, 3);
      extraChar = true;
    }
  } else {
    if (verbInfo.type === VerbType.Godan) {
      fullStem = getStems(verbInfo, 0);
      extraChar = false;
      validCausPassShortVer = (verbInfo.endingChar === "す")? false : true;
    }
  }

  if (fullStem instanceof Error) return fullStem;

  switch (formType) {
    case (PassCausForms.Pass):
      return {result: {...fullStem, suffix: fullStem.suffix + (extraChar? "ら" : "") + "れ"}};
    case (PassCausForms.Caus):
      return {result: {...fullStem, suffix: fullStem.suffix + (extraChar? "さ" : "") + (shortVer? "" : "せ")}, nowSu: shortVer};
    default: 
      // Causitive Passive
      return {result: {...fullStem, suffix: fullStem.suffix + (extraChar? "さ" : "") + ((shortVer && validCausPassShortVer)? "され" : "せられ")}, nowSu: shortVer && validCausPassShortVer};
  }
}