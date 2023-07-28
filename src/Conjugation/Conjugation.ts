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
