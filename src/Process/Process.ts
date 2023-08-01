import { ConjugationResult, getConjugation } from "../Conjugation/Conjugation";
import { VerbInfo, VerbType, FormInfo, Result } from "../typedefs";
import { ErrorMessages } from "../Defs/ErrorMessages";
import { checkVerbEndingIsValid } from "../Conjugation/Stems/Stems";
import { irregularVerbs } from "../Defs/VerbDefs";

export function processAndGetConjugation(unprocessedVerbInfo: VerbInfo, formInfo: FormInfo): Result | Error {
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

export function processAndGetConjugations(unprocessedVerbInfo: VerbInfo, formInfo: FormInfo[]): (Result | Error)[] | Error {
  const processVerbResult: ProcessedVerbInfo | Error = processVerbInfo(unprocessedVerbInfo);
  if (processVerbResult instanceof Error) {
    return processVerbResult;
  }

  let conjugationResults: (Result | Error)[] = [];
  formInfo.forEach(form => {
    const conjugationResult: ConjugationResult | Error = getConjugation(processVerbResult, form);
    if (conjugationResult instanceof Error) {
      conjugationResults.push(conjugationResult);
      return;
    }
  
    return conjugationResults.push(processConjugationResult(conjugationResult, processVerbResult));
  });

  return conjugationResults;
}

export function processVerbInfo(verbInfo: VerbInfo): ProcessedVerbInfo | Error {
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

  if (!checkVerbEndingIsValid(endingChar)) {
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
 
  const processedVerbInfo: ProcessedVerbInfo = 
    {rawStem: {kana: rawStemKana, kanji: rawStemKanji}, endingChar: endingChar, type: type, irregular: irregular};

  return processedVerbInfo;
}

export function processConjugationResult(conjugationResult: ConjugationResult, processedVerbInfo: ProcessedVerbInfo): Result {
  const suffixResult = conjugationResult.suffix;
  const kanjiStem = (conjugationResult.newKanjiRawStem !== undefined)? conjugationResult.newKanjiRawStem : processedVerbInfo.rawStem.kanji;
  const kanaStem = (conjugationResult.newKanaRawStem !== undefined)? conjugationResult.newKanaRawStem : processedVerbInfo.rawStem.kana;

  const result: Result = {kana: (kanaStem === undefined)? undefined : kanaStem + suffixResult, kanji: (kanjiStem === undefined)? undefined : kanjiStem + suffixResult};
  return result;
}


export type ProcessedVerbInfo = {rawStem: {kana?: string, kanji?: string}, endingChar: string, type: VerbType, irregular: false | VerbType};