import { ErrorMessages } from "../../Defs/ErrorMessages";
import { VerbType } from "../../Defs/VerbDefs";
import { AdditionalFormName } from "../../Defs/VerbFormDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { getTForm } from "../TForms/TForms";

export function getAdditionalForm(verbInfo: ProcessedVerbInfo, additionalForm: AdditionalFormName, shortVer: boolean): ProcessedVerbInfo | Error {
  // Return without ending char so it doesn't have to be slice off again later

  if (additionalForm === AdditionalFormName.TeShimau && shortVer) {
    return getChauForm(verbInfo);
  }

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
      suffixToAdd = "い";
      newEndingChar = "く";
      newVerbType = VerbType.Godan;
      newIrregular = VerbType.Iku;
      break;
    case AdditionalFormName.TeKuru:
      suffixToAdd = "く";
      newEndingChar = "る";
      newVerbType = VerbType.Ichidan;
      newIrregular = VerbType.Kuru;
      break;
    case AdditionalFormName.TeAgeru:
      suffixToAdd = "あげ";
      newEndingChar = "る";
      newVerbType = VerbType.Ichidan;
      newIrregular = false;
      break;
    case AdditionalFormName.TeKureru:
      suffixToAdd = "くれ";
      newEndingChar = "る";
      newVerbType = VerbType.Ichidan;
      newIrregular = VerbType.Kureru;
      break;
    case AdditionalFormName.TeMorau:
      suffixToAdd = "もら";
      newEndingChar = "う";
      newVerbType = VerbType.Godan;
      newIrregular = false;
      break;
    case AdditionalFormName.TeShimau:
      suffixToAdd = "しま";
      newEndingChar = "う";
      newVerbType = VerbType.Godan;
      newIrregular = false;
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

export function getChauForm(verbInfo: ProcessedVerbInfo): ProcessedVerbInfo | Error {
  const pastForm = getTForm(verbInfo, false);
  if (pastForm instanceof Error) {
    return pastForm;
  }
  const endingChar = pastForm.suffix.slice(-1);
  const newSuffix = pastForm.suffix.slice(0, -1) + ((endingChar === "だ")? "じゃ" : "ちゃ");

  const newKanaStem = verbInfo.rawStem.kana !== undefined?
    ((pastForm.newKanaRawStem !== undefined? pastForm.newKanaRawStem : verbInfo.rawStem.kana) + newSuffix)
    : undefined;
  const newKanjiStem = verbInfo.rawStem.kanji !== undefined? 
    ((pastForm.newKanjiRawStem !== undefined? pastForm.newKanjiRawStem : verbInfo.rawStem.kanji) + newSuffix)
    : undefined;

  const newVerbInfo: ProcessedVerbInfo = {
    rawStem: {
      kana: newKanaStem,
      kanji: newKanjiStem,
    },
    endingChar: "う",
    type: VerbType.Godan,
    irregular: false
  }

  return newVerbInfo;
}