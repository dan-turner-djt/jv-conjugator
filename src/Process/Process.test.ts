import { ConjugationResult } from "../Conjugation/Conjugation";
import { ErrorMessages } from "../Defs/ErrorMessages";
import { VerbInfo, VerbType } from "../Defs/VerbDefs";
import { ProcessedVerbInfo, Result, processConjugationResult, processVerbInfo } from "./Process";

describe('Process verb info', () => {
  it('processes basic info properly', () => {
    const rawVerbInfo: VerbInfo = {verb: {kana: "たべる", kanji: "食べる"}, type: VerbType.Ichidan};
    const processedVerbInfo: ProcessedVerbInfo | Error = processVerbInfo(rawVerbInfo);
    expect(processedVerbInfo).toEqual(
      {rawStem: {kana: "たべ", kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false}
    );
  });
  it('processes irregular info properly', () => {
    const rawVerbInfo: VerbInfo = {verb: {kana: "する", kanji: "為る"}, type: VerbType.Suru};
    const processedVerbInfo: ProcessedVerbInfo | Error = processVerbInfo(rawVerbInfo);
    expect(processedVerbInfo).toEqual(
      {rawStem: {kana: "す", kanji: "為"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Suru}
    );
  });
  it('processes kana-only info properly', () => {
    const rawVerbInfo: VerbInfo = {verb: {kana: "いらっしゃる"}, type: VerbType.Irassharu};
    const processedVerbInfo: ProcessedVerbInfo | Error = processVerbInfo(rawVerbInfo);
    expect(processedVerbInfo).toEqual(
      {rawStem: {kana: "いらっしゃ", kanji: undefined}, endingChar: "る", type: VerbType.Godan, irregular: VerbType.Irassharu}
    );
  });
  it('processes kanji-only info properly', () => {
    const rawVerbInfo: VerbInfo = {verb: {kanji: "食べる"}, type: VerbType.Ichidan};
    const processedVerbInfo: ProcessedVerbInfo | Error = processVerbInfo(rawVerbInfo);
    expect(processedVerbInfo).toEqual(
      {rawStem: {kana: undefined, kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false}
    );
  });
  it('returns an error if neither kana or kanji is given in the info', () => {
    const rawVerbInfo: VerbInfo = {verb: {}, type: VerbType.Ichidan};
    const processedVerbResult: Error = processVerbInfo(rawVerbInfo) as Error;
    expect(processedVerbResult.message).toEqual(ErrorMessages.NoKanaOrKanji);
  });
  it('returns an error if the verb is not a valid verb', () => {
    const rawVerbInfo: VerbInfo = {verb: {kanji: "食べ"}, type: VerbType.Ichidan};
    const processedVerbResult: Error = processVerbInfo(rawVerbInfo) as Error;
    expect(processedVerbResult.message).toEqual(ErrorMessages.NotAVerb);
  });
});

describe('Process conjugation results', () => {
  it('processes the basic suffix properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "たべ", kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
    const conjugationResult: ConjugationResult = {suffix: "ない"};
    const result: Result = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(result.kana).toEqual("たべない"); 
    expect(result.kanji).toEqual("食べない");
  });
  it('processes the suffix and new kana and kanji stems properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "す", kanji: "為"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Suru};
    const conjugationResult: ConjugationResult = {suffix: "ない", newKanaRawStem: "でき", newKanjiRawStem: "出来"};
    const result: Result = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(result.kana).toEqual("できない"); 
    expect(result.kanji).toEqual("出来ない");
  });
  it('processes basic kana-only info properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "たべ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
    const conjugationResult: ConjugationResult = {suffix: "ない"};
    const result: Result = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(result.kana).toEqual("たべない"); 
    expect(result.kanji).toEqual(undefined);
  });
  it('processes basic kanji-only info properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
    const conjugationResult: ConjugationResult = {suffix: "ない"};
    const result: Result = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(result.kana).toEqual(undefined);
    expect(result.kanji).toEqual("食べない");
  });
  it('processes the suffix and new kana stem of kana-only info properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "く"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Kuru};
    const conjugationResult: ConjugationResult = {suffix: "ない", newKanaRawStem: "こ", newKanjiRawStem: undefined};
    const result: Result = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(result.kana).toEqual("こない"); 
    expect(result.kanji).toEqual(undefined);
  });
  it('processes the suffix and new kana and kanji stems of kana-only info that returns new kana and kanji properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "す"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Suru};
    const conjugationResult: ConjugationResult = {suffix: "ない", newKanaRawStem: "でき", newKanjiRawStem: "出来"};
    const result: Result = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(result.kana).toEqual("できない"); 
    expect(result.kanji).toEqual("出来ない");
  });
  it('processes the suffix and new kana and kanji stems of kanji-only info that returns new kana and kanji properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kanji: "為"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Suru};
    const conjugationResult: ConjugationResult = {suffix: "ない", newKanaRawStem: "でき", newKanjiRawStem: "出来"};
    const result: Result = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(result.kana).toEqual("できない"); 
    expect(result.kanji).toEqual("出来ない");
  });
});