import { ErrorMessages } from "../Defs/ErrorMessages";
import { VerbType } from "../Defs/VerbDefs";
import { FormInfo, FormName } from "../Defs/VerbFormDefs";
import { ProcessedVerbInfo } from "../Process/Process";
import { getAdditionalForm } from "./AdditionalForms/AdditionalForms";
import { getAndProcessAuxForm } from "./AuxForms/AuxForms";
import { NegativeForms, getNegativeForm } from "./NegativeForms/NegativeForms";
import { getPoliteForm } from "./PoliteForms/PoliteForms";
import { getStems } from "./Stems/Stems";
import { getTForm } from "./TForms/TForms";

export type ConjugationResult = {suffix: string, newKanaRawStem?: string, newKanjiRawStem?: string};


export function getConjugation (verbInfo: ProcessedVerbInfo, formInfo: FormInfo): ConjugationResult | Error {
  if (formInfo.auxFormName !== undefined) {
    const auxFormResult: ProcessedVerbInfo | Error = getAndProcessAuxForm(verbInfo, formInfo.auxFormName, formInfo.shortVer);
    if (auxFormResult instanceof Error) {
      return auxFormResult;
    }
    verbInfo = auxFormResult;
  }

  if (formInfo.additionalFormName !== undefined) {
    const additionalFormResult: ProcessedVerbInfo | Error = getAdditionalForm(verbInfo, formInfo.additionalFormName, formInfo.shortVer);
    if (additionalFormResult instanceof Error) {
      return additionalFormResult;
    }
    verbInfo = additionalFormResult;
  }

  let result: ConjugationResult | Error;
  if (formInfo.polite === true) {
    result = getPoliteForm(verbInfo, formInfo.formName, formInfo.negative, formInfo.shortVer);
  } else {
    switch (formInfo.formName) {
      case FormName.Stem:
        result = getStem(verbInfo, formInfo.negative);
        break;
      case FormName.Present:
        result = getPresent(verbInfo, formInfo.negative);
        break;
      case FormName.Past:
        result = getPast(verbInfo, formInfo.negative);
        break;
      case FormName.Te:
        result = getTe(verbInfo, formInfo.negative);
        break;
      case FormName.Imperative:
        result = getImperative(verbInfo, formInfo.negative);
        break;
      case FormName.Volitional:
        result = getVolitional(verbInfo, formInfo.negative);
        break;
      case FormName.BaConditional:
        result = getEbaConditional(verbInfo, formInfo.negative);
        break;
      case FormName.TaraConditional:
        result = getTaraConditional(verbInfo, formInfo.negative);
        break;
      case FormName.Zu:
        result = getZu(verbInfo, formInfo.negative);
        break;
      case FormName.Naide:
        result = getNaide(verbInfo, formInfo.negative);
        break;
      case FormName.Tai:
        result = getTaiForm(verbInfo, formInfo.negative);
        break;
      default:
        result = new Error(ErrorMessages.UnknownFormName);
        break;
    }
  }

  if(result instanceof Error) return result;

  return {
    suffix: result.suffix,
    newKanaRawStem: (result.newKanaRawStem !== undefined)? result.newKanaRawStem : verbInfo.rawStem.kana,
    newKanjiRawStem: (result.newKanjiRawStem !== undefined)? result.newKanjiRawStem : verbInfo.rawStem.kanji,
  }
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

export function getZu(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
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

export function getImperative(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
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

export function getVolitional(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
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

export function getEbaConditional(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
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

export function getTaraConditional(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakattara);

  const taForm: ConjugationResult | Error = getTForm(verbInfo, false);
  if (taForm instanceof Error) return taForm;
  return {...taForm, suffix: taForm.suffix + "ら"};
}

export function getTaiForm(verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Tai);

  const stem: ConjugationResult | Error = getStems(verbInfo, 1);
  if (stem instanceof Error) return stem;
  return {...stem, suffix: stem.suffix + "たい"};
}
