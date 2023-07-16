import { ErrorMessages } from "../ErrorMessages";
import { VerbInfo, VerbType, irregularVerbs, kuruStems, stems, suruStems, tStems, taEndings, teEndings } from "./VerbDefs";
import { AuxiliaryFormName, FormInfo, FormName } from "./VerbFormDefs";

export type ProcessedVerbInfo = {rawStem: {kana?: string, kanji?: string}, endingChar: string, type: VerbType, irregular: false | VerbType};

export type ConjugationResult = {suffix: string, newKanaRawStem?: string, newKanjiRawStem?: string};

export type Result = {kana?: string, kanji?: string};

export const processVerbInfo = (verbInfo: VerbInfo): ProcessedVerbInfo | Error => {
  if (verbInfo.verb.kana === undefined && verbInfo.verb.kanji === undefined) {
    return new Error(ErrorMessages.NoKanaOrKanji);
  }

  let endingChar: string;

  let rawStemKana: string;
  if (verbInfo.verb.kana !== undefined) {
    rawStemKana = verbInfo.verb.kana.slice(0, -1);
    endingChar = verbInfo.verb.kana.slice(-1);
  }

  let rawStemKanji: string;
  if (verbInfo.verb.kanji !== undefined) {
    rawStemKanji = verbInfo.verb.kanji.slice(0, -1);
    endingChar = verbInfo.verb.kanji.slice(-1);
  }

  if (!stems.hasOwnProperty(endingChar)) {
    return new Error(ErrorMessages.NotAVerb);
  }

  let type: VerbType;
  let irregular: boolean | VerbType;
  if (verbInfo.type === VerbType.Ichidan || verbInfo.type === VerbType.Godan) {
    type = verbInfo.type;
    irregular = false;
  } else {
    type = irregularVerbs.find(t => t.type === verbInfo.type).mostly;
    irregular = verbInfo.type;
  }
 
  let processedVerbInfo: ProcessedVerbInfo = 
    {rawStem: {kana: rawStemKana, kanji: rawStemKanji}, endingChar: endingChar, type: type, irregular: irregular};

  return processedVerbInfo;
}

export const processConjugationResult = (conjugationResult: ConjugationResult, processedVerbInfo: ProcessedVerbInfo): Result => {
  const suffixResult = conjugationResult.suffix;
  const kanjiStem = (conjugationResult.newKanjiRawStem !== undefined)? conjugationResult.newKanjiRawStem : processedVerbInfo.rawStem.kanji;
  const kanaStem = (conjugationResult.newKanaRawStem !== undefined)? conjugationResult.newKanaRawStem : processedVerbInfo.rawStem.kana;

  const result: Result = {kana: (kanaStem === undefined)? undefined : kanaStem + suffixResult, kanji: (kanjiStem === undefined)? undefined : kanjiStem + suffixResult};
  return result;
}

export const processAndGetConjugation = (unprocessedVerbInfo: VerbInfo, formInfo: FormInfo): Result | Error => {
  const processVerbResult: ProcessedVerbInfo | Error = processVerbInfo(unprocessedVerbInfo);
  if (processVerbResult instanceof Error) {
    return processVerbResult;
  }
  const conjugationResult: ConjugationResult | Error = getConjugation(processVerbResult, formInfo);
  if (conjugationResult instanceof Error) {
    return conjugationResult;
  }

  return processConjugationResult(conjugationResult, processVerbResult);
}

export const getConjugation = (verbInfo: ProcessedVerbInfo, formInfo: FormInfo): ConjugationResult | Error => {
  if (formInfo.auxFormName) {
    const auxFormResult: ProcessedVerbInfo | Error = getAndProcessAuxForm(verbInfo, formInfo.auxFormName);
    if (auxFormResult instanceof Error) {
      return auxFormResult;
    }
    verbInfo = auxFormResult;
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

export const getAndProcessAuxForm = (verbInfo: ProcessedVerbInfo, auxForm: AuxiliaryFormName): ProcessedVerbInfo | Error => {
  const auxFormResult: ConjugationResult | Error = getAuxForm(verbInfo, auxForm);
  if (auxFormResult instanceof Error) {
    return auxFormResult;
  }

  const newVerbInfo: ProcessedVerbInfo = {
    rawStem: {
      kana: (auxFormResult.newKanaRawStem? auxFormResult.newKanaRawStem : verbInfo.rawStem.kana) + auxFormResult.suffix,
      kanji: (auxFormResult.newKanjiRawStem? auxFormResult.newKanjiRawStem : verbInfo.rawStem.kanji) + auxFormResult.suffix,
    },
    endingChar: "る",
    type: VerbType.Ichidan,
    irregular: false
  }

  return newVerbInfo;
}

export const getAuxForm = (verbInfo: ProcessedVerbInfo, auxForm: AuxiliaryFormName): ConjugationResult | Error => {
  switch (auxForm) {
    case AuxiliaryFormName.Potential:
      return;
    case AuxiliaryFormName.Passive:
      return;
    case AuxiliaryFormName.Causative:
      return;
    case AuxiliaryFormName.CausativePassive:
      return;
    default:
      return new Error(ErrorMessages.UnknownAuxFormName);
  }
}


/* Base conjugation getters */

const getStem = (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error => {
  if (negative) return new Error(ErrorMessages.NoNegativeForm);
  return getStems(verbInfo, 1);
}

const getPresent = (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult => {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nai);
  return {suffix: verbInfo.endingChar};
}

const getPast = (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult => {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakatta);
  return getTaForm(verbInfo);
}

const getTe = (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult => {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakute);
  return getTeForm(verbInfo);
}

const getZu = (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error => {
  if (negative) return new Error(ErrorMessages.NoNegativeForm);

  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Aru) {
      return {suffix: "らず"};
    }
    if (verbInfo.irregular === VerbType.Suru) {
      const stem = getStems(verbInfo, 2);
      return {...stem, suffix: stem.suffix + "ず"};
    }
    if (verbInfo.irregular === VerbType.Kuru) {
      const stem = getStems(verbInfo, 3);
      return {...stem, suffix: stem.suffix + "ず"};
    }
  }
  
  return getNegativeForm(verbInfo, NegativeForms.Zu);
}

const getNaide = (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult | Error => {
  if (negative) return new Error(ErrorMessages.NoNegativeForm);
  return getNegativeForm(verbInfo, NegativeForms.Naide);
}

const getImperative = (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult => {
  if (negative) return {suffix: verbInfo.endingChar + "な"};

  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Kureru) {
      return {suffix: ""};
    }
    if (verbInfo.irregular === VerbType.Suru) {
      const stem = getStems(verbInfo, 1);
      return {...stem, suffix: stem.suffix + "ろ"};
    }
    if (verbInfo.irregular === VerbType.Kuru) {
      const stem = getStems(verbInfo, 3);
      return {...stem, suffix: stem.suffix + "い"};
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return getStems(verbInfo, 2);
  }
  return {suffix: "ろ"};
}

const getVolitional = (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult => {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakarou);

  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Suru) {
      const stem = getStems(verbInfo, 1);
      return {...stem, suffix: stem.suffix + "よう"};
    }
    if (verbInfo.irregular === VerbType.Kuru) {
      const stem = getStems(verbInfo, 3);
      return {...stem, suffix: stem.suffix + "よう"};
    }
  }
  
  if (verbInfo.type === VerbType.Godan) {
    const stem = getStems(verbInfo, 3);
    return {...stem, suffix: stem.suffix + "う"};
  }
  return {suffix: "よう"};
}

const getEbaConditional = (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult => {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakereba);

  if (verbInfo.irregular === VerbType.Suru || verbInfo.irregular === VerbType.Kuru) {
    return {suffix: "れば"};
  }

  if (verbInfo.type === VerbType.Godan) {
    const stem = getStems(verbInfo, 2);
    return {...stem, suffix: stem.suffix + "ば"};
  }
  return {suffix: "れば"};
}

const getTaraConditional = (verbInfo: ProcessedVerbInfo, negative: boolean): ConjugationResult => {
  if (negative) return getNegativeForm(verbInfo, NegativeForms.Nakattara);

  const taForm = getTaForm(verbInfo);
  return {...taForm, suffix: taForm.suffix + "ら"};
}



const getPotentialFull = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPotentialForms(verbInfo, true, false);
}

const getPotentialShort = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPotentialForms(verbInfo, false, false);
}

const getNegPotentialFull = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPotentialForms(verbInfo, true, true);
}

const getNegPotentialShort = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPotentialForms(verbInfo, false, true);
}

const getPassive = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPassCausForms(verbInfo, PassCausForms.Pass, false);
}

const getNegPassive = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPassCausForms(verbInfo, PassCausForms.Pass, true);
}

const getCausative = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPassCausForms(verbInfo, PassCausForms.Caus, false);
}

const getNegCausative = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPassCausForms(verbInfo, PassCausForms.Caus, true);
}

const getCausPassive = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPassCausForms(verbInfo, PassCausForms.CausPass, false);
}

const getNegCausPassive = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPassCausForms(verbInfo, PassCausForms.CausPass, true);
}

/* Conjugation helpers */

const getPoliteForm = (verbInfo: ProcessedVerbInfo, formName: FormName, negative: boolean): ConjugationResult | Error => {
  const stemInfo = getStems(verbInfo, 1);

  switch (formName) {
    case FormName.Present:
      return {...stemInfo, suffix: stemInfo.suffix + (negative? "ません" : "ます")};
    case FormName.Past:
      return {...stemInfo, suffix: stemInfo.suffix + (negative? "ませんでした" : "ました")};
    case FormName.Te:
      return {...stemInfo, suffix: stemInfo.suffix + (negative? "ませんで" : "まして")};
    case FormName.Naide:
      if (negative) return new Error(ErrorMessages.NoNegativeForm);
      return {...stemInfo, suffix: stemInfo.suffix + "ませんで"};
    case FormName.Volitional:
      if (negative) return new Error(ErrorMessages.NoNegativeForm);
      return {...stemInfo, suffix: stemInfo.suffix + "ましょう"};
    case FormName.Imperative:
      if (negative) return new Error(ErrorMessages.NoNegativeForm);
      return {...stemInfo, suffix: stemInfo.suffix + "なさい"};
    case FormName.TaraConditional:
      return {...stemInfo, suffix: stemInfo.suffix + + (negative? "ませんでしたら" : "ましたら")};
    case FormName.BaConditional:
      if (negative) return new Error(ErrorMessages.NoNegativeForm);
      return {...stemInfo, suffix: stemInfo.suffix + "ますれば"};
    default:
      return new Error(ErrorMessages.NoPoliteForm);
  }
}

export enum NegativeForms {Nai, Nakute, Nakatta, Naide, Nakereba, Nakattara, Nakarou, Zu}
const getNegativeForm = (verbInfo: ProcessedVerbInfo, formType: NegativeForms): ConjugationResult => {
  const stemInfo = getNegativeStem(verbInfo);

  switch (formType) {
    case NegativeForms.Nai:
      return {...stemInfo, suffix: stemInfo.suffix + "い"};
    case NegativeForms.Nakute:
      return {...stemInfo, suffix: stemInfo.suffix + "くて"};
    case NegativeForms.Nakatta:
      return {...stemInfo, suffix: stemInfo.suffix + "かった"};
    case NegativeForms.Naide:
      return {...stemInfo, suffix: stemInfo.suffix + "いで"};
    case NegativeForms.Nakereba:
      return {...stemInfo, suffix: stemInfo.suffix + "ければ"};
    case NegativeForms.Nakattara:
      return {...stemInfo, suffix: stemInfo.suffix + "かったら"};
    case NegativeForms.Nakarou:
      return {...stemInfo, suffix: stemInfo.suffix + "かろう"};
    case NegativeForms.Zu:
      const zuStemInfo = getStems(verbInfo, 0);
      return {...zuStemInfo, suffix: zuStemInfo.suffix + "ず"};
    default:
      console.log("Unknown negative form");
      return stemInfo;
  }
}

const getNegativeStem = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Aru) {
      return {suffix: "な", newKanaRawStem: "", newKanjiRawStem: ""};
    }
    if (verbInfo.irregular === VerbType.Suru) {
      const stemInfo = getStems(verbInfo, 1);
      return {...stemInfo, suffix: "な"};
    }
    if (verbInfo.irregular === VerbType.Kuru) {
      const stemInfo = getStems(verbInfo, 3);
      return {...stemInfo, suffix: "な"};
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return {suffix: getStems(verbInfo, 0).suffix + "な"};
  }
  return {suffix: "な"};
}

const getStems = (verbInfo: ProcessedVerbInfo, stemIndex: number, ): ConjugationResult => {
  if (verbInfo.irregular !== false) {
    if (stemIndex === 1 &&
    (  verbInfo.irregular === VerbType.Irassharu
    || verbInfo.irregular === VerbType.Ossharu
    || verbInfo.irregular === VerbType.Kudasaru
    || verbInfo.irregular === VerbType.Gozaru
    || verbInfo.irregular === VerbType.Nasaru)) {
      return {suffix: "い"};
    }

    if (verbInfo.irregular === VerbType.Suru) {
      return {suffix: "", newKanaRawStem: suruStems[stemIndex]};
    }

    if (verbInfo.irregular === VerbType.Kuru) {
      return {suffix: "", newKanaRawStem: kuruStems[stemIndex]};
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return {suffix: stems[verbInfo.endingChar][stemIndex]};
  }
  return {suffix: ""};
}

const getTeForm = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Iku) {
      return {suffix: "って"};
    }
    if (verbInfo.irregular === VerbType.Tou) {
      return {suffix: "うて"};
    }
    if (verbInfo.irregular === VerbType.Suru || verbInfo.irregular === VerbType.Kuru) {
      const stemInfo = getStems(verbInfo, 1);
      return {...stemInfo, suffix: stemInfo.suffix + "て"};
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    return {suffix: tStems[verbInfo.endingChar] + teEndings[verbInfo.endingChar]};
  }
  return {suffix: "て"};
}

const getTaForm = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Iku) {
      return {suffix: "った"};
    }
    if (verbInfo.irregular === VerbType.Tou) {
      return {suffix: "うた"};
    }
    if (verbInfo.irregular === VerbType.Suru || verbInfo.irregular === VerbType.Kuru) {
      const stemInfo = getStems(verbInfo, 1);
      return {...stemInfo, suffix: stemInfo.suffix + "た"};
    }
  }
  
  if (verbInfo.type === VerbType.Godan) {
    return {suffix: tStems[verbInfo.endingChar] + taEndings[verbInfo.endingChar]};
  }
  return {suffix: "た"};
}

const getPotentialForms = (verbInfo: ProcessedVerbInfo, full: boolean, negative: boolean): ConjugationResult => {
  if (verbInfo.irregular === VerbType.Suru) {
    return {suffix: negative? "ない" : "る", newKanjiRawStem: "出来", newKanaRawStem: "でき"};
  }
  if (verbInfo.irregular === VerbType.Kuru) {
    const stem = getStems(verbInfo, 3);
    return {...stem, suffix: stem.suffix + (full? "ら" : "") + (negative? "れない" : "れる")};
  }

  if (verbInfo.type === VerbType.Godan) {
    const stem = getStems(verbInfo, 2);
    return {...stem, suffix: stem.suffix + (negative? "ない" : "る")};
  }
  return {suffix: (full? "ら" : "") + (negative? "れない" : "れる")};
}

export enum PassCausForms {Pass, Caus, CausPass}
const getPassCausForms = (verbInfo: ProcessedVerbInfo, formType: PassCausForms, negative: boolean): ConjugationResult => {
  let fullStem: ConjugationResult = {suffix: ""};
  let extraChar = true;
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
    }
  }

  switch (formType) {
    case (PassCausForms.Pass):
      return {...fullStem, suffix: fullStem.suffix + (extraChar? "ら" : "") + (negative? "れない" : "れる")};
    case (PassCausForms.Caus):
      return {...fullStem, suffix: fullStem.suffix + (extraChar? "さ" : "") + (negative? "せない" : "せる")};
    case (PassCausForms.CausPass):
      return {...fullStem, suffix: fullStem.suffix + (extraChar? "さ" : "") + (negative? "せられない" : "せられる")};
    default: {
      console.log ("Unkown PassCaus form");
      return fullStem;
    }
  }
}