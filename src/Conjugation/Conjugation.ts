import { ErrorMessages } from "../Defs/ErrorMessages";
import { VerbType } from "../Defs/VerbDefs";
import { AdditionalFormName, AuxiliaryFormName, FormInfo, FormName } from "../Defs/VerbFormDefs";
import { ProcessedVerbInfo } from "../Process/Process";
import { NegativeForms, getNegativeForm } from "./NegativeForms/NegativeForms";
import { getPoliteForm } from "./PoliteForms/PoliteForms";
import { getStems } from "./Stems/Stems";
import { getTForm } from "./TForms/TForms";

export type ConjugationResult = {suffix: string, newKanaRawStem?: string, newKanjiRawStem?: string};


export function getConjugation (verbInfo: ProcessedVerbInfo, formInfo: FormInfo): ConjugationResult | Error {
  if (formInfo.auxFormName) {
    const auxFormResult: ProcessedVerbInfo | Error = getAndProcessAuxForm(verbInfo, formInfo.auxFormName, formInfo.shortVer);
    if (auxFormResult instanceof Error) {
      return auxFormResult;
    }
    verbInfo = auxFormResult;
  }

  if (formInfo.additionalFormName) {
    const additionalFormResult: ProcessedVerbInfo | Error = getAdditionalForm(verbInfo, formInfo.additionalFormName, formInfo.shortVer);
    if (additionalFormResult instanceof Error) {
      return additionalFormResult;
    }
    verbInfo = additionalFormResult;
  }

  if (formInfo.polite) {
    return getPoliteForm(verbInfo, formInfo.formName, formInfo.negative);
  }

  switch (formInfo.formName) {
    case FormName.Stem:
      return getStem(verbInfo, formInfo.negative);
    case FormName.Present:
      return getPresent(verbInfo, formInfo.negative);
    case FormName.Past:
      return getPast(verbInfo, formInfo.negative);
    case FormName.Te:
      return getTe(verbInfo, formInfo.negative);
    case FormName.Imperative:
      return getImperative(verbInfo, formInfo.negative);
    case FormName.Volitional:
      return getVolitional(verbInfo, formInfo.negative);
    case FormName.BaConditional:
      return getEbaConditional(verbInfo, formInfo.negative);
    case FormName.TaraConditional:
      return getTaraConditional(verbInfo, formInfo.negative);
    case FormName.Zu:
      return getZu(verbInfo, formInfo.negative);
    case FormName.Naide:
      return getNaide(verbInfo, formInfo.negative);
    default:
      return new Error(ErrorMessages.UnknownFormName);
  }
}

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

export function getAdditionalForm(verbInfo: ProcessedVerbInfo, additionalForm: AdditionalFormName, shortVer: boolean): ProcessedVerbInfo | Error {
  // Return without ending char so it doesn't have to be slice off again later

  const teFormResult: ConjugationResult | Error = getTForm(verbInfo, true);
  if (teFormResult instanceof Error) return teFormResult;
  let suffixToAdd: string;
  let newEndingChar: string;
  let newVerbType: VerbType;
  let newIrregular: VerbType | false;
  let newTeFormResultSuffix: string = teFormResult.suffix;

  switch (additionalForm) {
    case AdditionalFormName.Continuous:
      suffixToAdd = shortVer? "" : "い";
      newEndingChar = "る";
      newVerbType = VerbType.Ichidan;
      newIrregular = false;
      break;
    case AdditionalFormName.TeAru:
      suffixToAdd = "あ";
      newEndingChar = "る";
      newVerbType = VerbType.Godan;
      newIrregular = VerbType.Aru;
      break;
    case AdditionalFormName.TeOku:
      newTeFormResultSuffix = shortVer? teFormResult.suffix.slice(0, -1) : teFormResult.suffix;
      suffixToAdd = shortVer? (teFormResult.suffix.slice(-1) === "で"? "ど" : "と") : "お";
      newEndingChar = "く";
      newVerbType = VerbType.Godan;
      newIrregular = false;
      break;
    case AdditionalFormName.TeIku:
      suffixToAdd = shortVer? "" : "い";
      newEndingChar = "る";
      newVerbType = VerbType.Godan;
      newIrregular = VerbType.Iku;
      break;
    case AdditionalFormName.TeKuru:
      suffixToAdd = "く";
      newEndingChar = "る";
      newVerbType = VerbType.Ichidan;
      newIrregular = VerbType.Kuru;
      break;
    default:
      return new Error(ErrorMessages.UnknownAdditionalFormName);
  }

  const newKanaStem = verbInfo.rawStem.kana !== undefined?
    ((teFormResult.newKanaRawStem !== undefined? teFormResult.newKanaRawStem : verbInfo.rawStem.kana) + newTeFormResultSuffix + suffixToAdd)
    : undefined;
  const newKanjiStem = verbInfo.rawStem.kanji !== undefined? 
    ((teFormResult.newKanjiRawStem !== undefined? teFormResult.newKanjiRawStem : verbInfo.rawStem.kanji) + newTeFormResultSuffix + suffixToAdd)
    : undefined;

  const newVerbInfo: ProcessedVerbInfo = {
    rawStem: {
      kana: newKanaStem,
      kanji: newKanjiStem,
    },
    endingChar: newEndingChar,
    type: newVerbType,
    irregular: newIrregular
  }

  return newVerbInfo;
}

function getStem (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return new Error(ErrorMessages.NoNegativeForm);
  return getStems(verbInfo, 1);
}

function getPresent(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nai);
  return {suffix: verbInfo.endingChar};
}

function getPast(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakatta);
  return getTForm(verbInfo, false);
}

function getTe(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakute);
  return getTForm(verbInfo, true);
}

function getZu(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return new Error(ErrorMessages.NoNegativeForm);

  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Aru) {
      return {suffix: "らず"};
    }
    if (verbInfo.irregular === VerbType.Suru) {
      const stem: ConjugationResult | Error = getStems(verbInfo, 2);
      if (stem instanceof Error) return stem;
      return {...stem, suffix: stem.suffix + "ず"};
    }
    if (verbInfo.irregular === VerbType.Kuru) {
      const stem: ConjugationResult | Error = getStems(verbInfo, 3);
      if (stem instanceof Error) return stem;
      return {...stem, suffix: stem.suffix + "ず"};
    }
  }
  
  return getNegativeForm(verbInfo, NegativeForms.Zu);
}

function getNaide(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return new Error(ErrorMessages.NoNegativeForm);
  return getNegativeForm(verbInfo, NegativeForms.Naide);
}

function getImperative(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return {suffix: verbInfo.endingChar + "な"};

  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Kureru) {
      return {suffix: ""};
    }
    if (verbInfo.irregular === VerbType.Suru) {
      const stem: ConjugationResult | Error = getStems(verbInfo, 1);
      if (stem instanceof Error) return stem;
      return {...stem, suffix: stem.suffix + "ろ"};
    }
    if (verbInfo.irregular === VerbType.Kuru) {
      const stem: ConjugationResult | Error = getStems(verbInfo, 3);
      if (stem instanceof Error) return stem;
      return {...stem, suffix: stem.suffix + "い"};
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 2);
  }
  return {suffix: "ろ"};
}

function getVolitional(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakarou);

  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Suru) {
      const stem: ConjugationResult | Error = getStems(verbInfo, 1);
      if (stem instanceof Error) return stem;
      return {...stem, suffix: stem.suffix + "よう"};
    }
    if (verbInfo.irregular === VerbType.Kuru) {
      const stem: ConjugationResult | Error = getStems(verbInfo, 3);
      if (stem instanceof Error) return stem;
      return {...stem, suffix: stem.suffix + "よう"};
    }
  }
  
  if (verbInfo.type === VerbType.Godan) {
    const stem: ConjugationResult | Error = getStems(verbInfo, 3);
    if (stem instanceof Error) return stem;
    return {...stem, suffix: stem.suffix + "う"};
  }
  return {suffix: "よう"};
}

function getEbaConditional(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakereba);

  if (verbInfo.irregular === VerbType.Suru || verbInfo.irregular === VerbType.Kuru) {
    return {suffix: "れば"};
  }

  if (verbInfo.type === VerbType.Godan) {
    const stem: ConjugationResult | Error = getStems(verbInfo, 2);
    if (stem instanceof Error) return stem;
    return {...stem, suffix: stem.suffix + "ば"};
  }
  return {suffix: "れば"};
}

function getTaraConditional(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakattara);

  const taForm: ConjugationResult | Error = getTForm(verbInfo, false);
  if (taForm instanceof Error) return taForm;
  return {...taForm, suffix: taForm.suffix + "ら"};
}

/* Conjugation helpers */

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
