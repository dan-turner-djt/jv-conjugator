import { ErrorMessages } from "../ErrorMessages";
import { VerbInfo, VerbType, irregularVerbs, kuruStems, stems, suruStems, tStems, taEndings, teEndings } from "./VerbDefs";
import { FormName } from "./VerbFormDefs";

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

export const processAndGetConjugation = (unprocessedVerbInfo: VerbInfo, form: FormName): Result | Error => {
  const processVerbResult: ProcessedVerbInfo | Error = processVerbInfo(unprocessedVerbInfo);
  if (processVerbResult instanceof Error) {
    return processVerbResult;
  }
  const processedVerbInfo: ProcessedVerbInfo = processVerbResult;
  const conjugationResult: ConjugationResult = getConjugation(processedVerbInfo, form);
  return processConjugationResult(conjugationResult, processedVerbInfo);
}

export const getConjugation = (verbInfo: ProcessedVerbInfo, form: FormName): ConjugationResult => {
  switch (form) {
    case FormName.Stem:
      return getStem(verbInfo);
    case FormName.Present:
      return getPresent(verbInfo);
    case FormName.PresentPol:
      return getPresentPol(verbInfo);
    case FormName.Negative:
      return getNegative(verbInfo);
    case FormName.NegPol:
      return getNegPol(verbInfo);
    case FormName.Past:
      return getPast(verbInfo);
    case FormName.PastPol:
      return getPastPol(verbInfo);
    case FormName.NegPast:
      return getNegPast(verbInfo);
    case FormName.NegPastPol:
      return getNegPastPol(verbInfo);
    case FormName.Te:
      return getTe(verbInfo);
    case FormName.NegTe:
      return getNegTe(verbInfo);
    case FormName.Naide:
      return getNaide(verbInfo);
    case FormName.Zu:
      return getZu(verbInfo);
    case FormName.PotentialFull:
      return getPotentialFull(verbInfo);
    case FormName.PotentialShort:
      return getPotentialShort(verbInfo);
    case FormName.NegPotentialFull:
      return getNegPotentialFull(verbInfo);
    case FormName.NegPotentialShort:
      return getNegPotentialShort(verbInfo);
    case FormName.Passive:
      return getPassive(verbInfo);
    case FormName.NegPassive:
      return getNegPassive(verbInfo);
    case FormName.Causative:
      return getCausative(verbInfo);
    case FormName.NegCausative:
      return getNegCausative(verbInfo);
    case FormName.CausPassive:
      return getCausPassive(verbInfo);
    case FormName.NegCausPassive:
      return getNegCausPassive(verbInfo);
    case FormName.Imperative:
      return getImperative(verbInfo);
    case FormName.NegImperative:
      return getNegImperative(verbInfo);
    case FormName.Nasai:
      return getNasai(verbInfo);
    case FormName.Volitional:
      return getVolitional(verbInfo);
    case FormName.VolitionalPol:
      return getVolitionalPol(verbInfo);
    case FormName.BaConditional:
      return getEbaConditional(verbInfo);
    case FormName.NegBaConditional:
      return getNegEbaConditional(verbInfo);
    case FormName.TaraConditional:
      return getTaraConditional(verbInfo);
    case FormName.NegTaraConditional:
      return getNegTaraConditional(verbInfo);
    default:
      console.log("Unknown form");
      return {suffix: verbInfo.endingChar};
  }
}


/* Base conjugation getters */

const getStem = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getStems(verbInfo, 1);
}

const getPresent = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return {suffix: verbInfo.endingChar};
}

const getPresentPol = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPoliteForm(verbInfo, PoliteForms.Masu);
}

const getNegative = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getNegativeForm(verbInfo, NegativeForms.Nai);
}

const getNegPol = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPoliteForm(verbInfo, PoliteForms.Masen);
}

const getPast = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getTaForm(verbInfo);
}

const getPastPol = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPoliteForm(verbInfo, PoliteForms.Mashita);
}

const getNegPast = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getNegativeForm(verbInfo, NegativeForms.Nakatta);
}

const getNegPastPol = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPoliteForm(verbInfo, PoliteForms.Masendeshita);
}

const getTe = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getTeForm(verbInfo);
}

const getNegTe = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getNegativeForm(verbInfo, NegativeForms.Nakute);
}

const getNaide = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getNegativeForm(verbInfo, NegativeForms.Naide);
}

const getZu = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
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

const getImperative = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
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

const getNegImperative = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return {suffix: verbInfo.endingChar + "な"};
}

const getNasai = (verbInfo: ProcessedVerbInfo): ConjugationResult=> {
  const stem = getStems(verbInfo, 1);
  return {...stem, suffix: stem.suffix + "なさい"};
}

const getVolitional = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
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

const getVolitionalPol = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getPoliteForm(verbInfo, PoliteForms.Mashou);
}

const getEbaConditional = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  if (verbInfo.irregular === VerbType.Suru || verbInfo.irregular === VerbType.Kuru) {
    return {suffix: "れば"};
  }

  if (verbInfo.type === VerbType.Godan) {
    const stem = getStems(verbInfo, 2);
    return {...stem, suffix: stem.suffix + "ば"};
  }
  return {suffix: "れば"};
}

const getNegEbaConditional = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getNegativeForm(verbInfo, NegativeForms.Nakereba);
}

const getTaraConditional = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  const taForm = getTaForm(verbInfo);
  return {...taForm, suffix: taForm.suffix + "ら"};
}

const getNegTaraConditional = (verbInfo: ProcessedVerbInfo): ConjugationResult => {
  return getNegativeForm(verbInfo, NegativeForms.Nakattara);
}


/* Conjugation helpers */

export enum PoliteForms {Masu, Masen, Mashita, Masendeshita, Mashite, Masende, Mashou}
const getPoliteForm = (verbInfo: ProcessedVerbInfo, formType: PoliteForms): ConjugationResult => {
  const stemInfo = getStems(verbInfo, 1);

  switch (formType) {
    case PoliteForms.Masu:
      return {...stemInfo, suffix: stemInfo.suffix + "ます"};
    case PoliteForms.Masen:
      return {...stemInfo, suffix: stemInfo.suffix + "ません"};
    case PoliteForms.Mashita:
      return {...stemInfo, suffix: stemInfo.suffix + "ました"};
    case PoliteForms.Masendeshita:
      return {...stemInfo, suffix: stemInfo.suffix + "ませんでした"};
    case PoliteForms.Mashite:
      return {...stemInfo, suffix: stemInfo.suffix + "まして"};
    case PoliteForms.Masende:
      return {...stemInfo, suffix: stemInfo.suffix + "ませんで"};
    case PoliteForms.Mashou:
      return {...stemInfo, suffix: stemInfo.suffix + "ましょう"};
    default:
      console.log("Unknown polite form");
      return stemInfo;
  }
}

export enum NegativeForms {Nai, Nakute, Nakatta, Naide, Nakereba, Nakattara, Zu}
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