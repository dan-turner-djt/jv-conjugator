import { ErrorMessages } from "../../Defs/ErrorMessages";
import { VerbType } from "../../Defs/VerbDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { checkVerbEndingIsValid, getStems, getTStem } from "./Stems";

describe('Get stems', () => {
  function testStems(verbInfo: ProcessedVerbInfo, stem: number, expected: ConjugationResult | Error) {
    const result: ConjugationResult | Error = getStems(verbInfo, stem);
    expect(result).toEqual(expected);
  }

  function testGodanStems (endingChar: string, expected: string[]) {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: '', kanji: ''}, endingChar: endingChar, type: VerbType.Godan, irregular: false};
    testStems(verbInfo, 0, {suffix: expected[0]});
    testStems(verbInfo, 1, {suffix: expected[1]});
    testStems(verbInfo, 2, {suffix: expected[2]});
    testStems(verbInfo, 3, {suffix: expected[3]});
  }

  it('returns an error if the stem index is invalid', () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: 'たべ', kanji: '食べ'}, endingChar: 'る', type: VerbType.Ichidan, irregular: false};
    testStems(verbInfo, -1, new Error(ErrorMessages.InvalidIndex));
    testStems(verbInfo, 4, new Error(ErrorMessages.InvalidIndex));
  });
  it('gets ichidan stems correctly', () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: 'たべ', kanji: '食べ'}, endingChar: 'る', type: VerbType.Ichidan, irregular: false};
    testStems(verbInfo, 0, {suffix: ""});
  });
  it('gets godan stems correctly', () => {
    testGodanStems("う", ["わ", "い", "え", "お"]);
    testGodanStems("く", ["か", "き", "け", "こ"]);
    testGodanStems("ぐ", ["が", "ぎ", "げ", "ご"]);
    testGodanStems("す", ["さ", "し", "せ", "そ"]);
    testGodanStems("つ", ["た", "ち", "て", "と"]);
    testGodanStems("ぬ", ["な", "に", "ね", "の"]);
    testGodanStems("ぶ", ["ば", "び", "べ", "ぼ"]);
    testGodanStems("む", ["ま", "み", "め", "も"]);
    testGodanStems("る", ["ら", "り", "れ", "ろ"]);
  });
  it('gets irregular keigo verb stems correctly', () => {
    let verbInfo: ProcessedVerbInfo = {rawStem: {kana: 'いらっしゃ'}, endingChar: 'る', type: VerbType.Godan, irregular: VerbType.Irassharu};
    testStems(verbInfo, 1, {suffix: "い"});
    verbInfo = {rawStem: {kana: 'おっしゃ'}, endingChar: 'る', type: VerbType.Godan, irregular: VerbType.Ossharu};
    testStems(verbInfo, 1, {suffix: "い"});
    verbInfo = {rawStem: {kana: 'くださ'}, endingChar: 'る', type: VerbType.Godan, irregular: VerbType.Kudasaru};
    testStems(verbInfo, 1, {suffix: "い"});
    verbInfo = {rawStem: {kana: 'ござ'}, endingChar: 'る', type: VerbType.Godan, irregular: VerbType.Gozaru};
    testStems(verbInfo, 1, {suffix: "い"});
    verbInfo = {rawStem: {kana: 'なさ'}, endingChar: 'る', type: VerbType.Godan, irregular: VerbType.Nasaru};
    testStems(verbInfo, 1, {suffix: "い"});
  });
  it('gets suru stems correctly', () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: 'す', kanji: '為'}, endingChar: 'る', type: VerbType.Ichidan, irregular: VerbType.Suru};
    testStems(verbInfo, 0, {newKanaRawStem: "さ", suffix: ""});
    testStems(verbInfo, 1, {newKanaRawStem: "し", suffix: ""});
    testStems(verbInfo, 2, {newKanaRawStem: "せ", suffix: ""});
    testStems(verbInfo, 3, {newKanaRawStem: "そ", suffix: ""});
  });
  it('gets kuru stems correctly', () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: 'く', kanji: '来'}, endingChar: 'る', type: VerbType.Ichidan, irregular: VerbType.Kuru};
    testStems(verbInfo, 0, {newKanaRawStem: "か", suffix: ""});
    testStems(verbInfo, 1, {newKanaRawStem: "き", suffix: ""});
    testStems(verbInfo, 2, {newKanaRawStem: "け", suffix: ""});
    testStems(verbInfo, 3, {newKanaRawStem: "こ", suffix: ""});
  });
});

describe('Tstems', () => {
  it('gets Tstems correctly', () => {
    expect(getTStem('う')).toEqual('っ');
    expect(getTStem('く')).toEqual('い');
    expect(getTStem('ぐ')).toEqual('い');
    expect(getTStem('す')).toEqual('し');
    expect(getTStem('つ')).toEqual('っ');
    expect(getTStem('ぬ')).toEqual('ん');
    expect(getTStem('ぶ')).toEqual('ん');
    expect(getTStem('む')).toEqual('ん');
    expect(getTStem('る')).toEqual('っ');
  });
});

describe('Verb validity', () => {
  it('can check if a verb ending is valid', () => {
    let result: boolean = checkVerbEndingIsValid("る");
    expect(result).toBe(true);
    result = checkVerbEndingIsValid("ら");
    expect(result).toBe(false);
  });
});