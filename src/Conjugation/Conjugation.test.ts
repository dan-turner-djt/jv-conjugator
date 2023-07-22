import { VerbType } from "../Defs/VerbDefs";
import { ProcessedVerbInfo } from "../Process/Process";
import { ConjugationResult, getPoliteForm, getStems } from "./Conjugation";
import { FormName } from "../Defs/VerbFormDefs";
import { ErrorMessages } from "../Defs/ErrorMessages";

import conjugation = require('../Conjugation/Conjugation');


describe('Polite forms', () => {
  const verbInfo: ProcessedVerbInfo = {rawStem: {kana: 'あ', kanji: '会'}, endingChar: 'う', type: VerbType.Godan, irregular: false};
  const spy_getStems = jest.spyOn(conjugation, 'getStems');
  const stemSuffix: string = "い";

  function testPoliteForm(formName: FormName, negative: boolean, expected: ConjugationResult | Error) {
    const result: ConjugationResult | Error = getPoliteForm(verbInfo, formName, negative);
    expect(spy_getStems).toBeCalledWith(verbInfo, 1);
    expect(result).toEqual(expected);
  }

  it('conjugates positive forms correctly', () => {
    testPoliteForm(FormName.Present, false, {suffix: stemSuffix + 'ます'});
    testPoliteForm(FormName.Past, false, {suffix: stemSuffix + 'ました'});
    testPoliteForm(FormName.Te, false, {suffix: stemSuffix + 'まして'});
    testPoliteForm(FormName.Naide, false, {suffix: stemSuffix + 'ませんで'});
    testPoliteForm(FormName.Volitional, false, {suffix: stemSuffix + 'ましょう'});
    testPoliteForm(FormName.Imperative, false, {suffix: stemSuffix + 'なさい'});
    testPoliteForm(FormName.TaraConditional, false, {suffix: stemSuffix + 'ましたら'});
    testPoliteForm(FormName.BaConditional, false, {suffix: stemSuffix + 'ますれば'});
    testPoliteForm(FormName.Zu, false, new Error(ErrorMessages.NoPoliteForm));
  });
  it('conjugates negative forms correctly', () => {
    testPoliteForm(FormName.Present, true, {suffix: stemSuffix + 'ません'});
    testPoliteForm(FormName.Past, true, {suffix: stemSuffix + 'ませんでした'});
    testPoliteForm(FormName.Te, true, {suffix: stemSuffix + 'ませんで'});
    testPoliteForm(FormName.Naide, true, new Error(ErrorMessages.NoNegativeForm));
    testPoliteForm(FormName.Volitional, true, new Error(ErrorMessages.NoNegativeForm));
    testPoliteForm(FormName.Imperative, true, new Error(ErrorMessages.NoNegativeForm));
    testPoliteForm(FormName.TaraConditional, true, {suffix: stemSuffix + 'ませんでしたら'});
    testPoliteForm(FormName.BaConditional, true, new Error(ErrorMessages.NoNegativeForm));
    testPoliteForm(FormName.Zu, true, new Error(ErrorMessages.NoPoliteForm));
  });
});

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

/*describe('Ichidan conjugation', () => {
  it ('conjugates 見る correctly', () => {
    const verbInfo: VerbInfo = {verb: {kana: "みる", kanji: "見る"}, type: VerbType.Ichidan};

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const result: Result = processAndGetConjugation(verbInfo, Number(value)) as Result;
      const expected = miruConjugations.find(o => o.form === Number(value))?.expected;
      expect(result.kana).toEqual(expected[1]);
      expect(result.kanji).toEqual(expected[0]);
    }
  });
});

describe('Godan conjugation', () => {
  it ('conjugates 会う correctly', () => {
    const verbInfo: VerbInfo = {verb: {kana: "あう", kanji: "会う"}, type: VerbType.Godan};

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const result: Result = processAndGetConjugation(verbInfo, Number(value)) as Result;
      const expected = auConjugations.find(o => o.form === Number(value))?.expected;
      expect(result.kana).toEqual(expected[1]);
      expect(result.kanji).toEqual(expected[0]);
    }
  });
});

describe('Irregular conjugation', () => {
  it('conjugates する correctly', () => {
    const verbInfo: VerbInfo = {verb: {kana: "する", kanji: "為る"}, type: VerbType.Suru};

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const result: Result = processAndGetConjugation(verbInfo, Number(value)) as Result;
      const expected = suruConjugations.find(o => o.form === Number(value))?.expected;
      expect(result.kana).toEqual(expected[1]);
      expect(result.kanji).toEqual(expected[0]);
    }
  });
  it('conjugates くる correctly', () => {
    const verbInfo: VerbInfo = {verb: {kana: "くる", kanji: "来る"}, type: VerbType.Kuru};

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const result: Result = processAndGetConjugation(verbInfo, Number(value)) as Result;
      const expected = kuruConjugations.find(o => o.form === Number(value))?.expected;
      expect(result.kana).toEqual(expected[1]);
      expect(result.kanji).toEqual(expected[0]);
    }
  });
  it('conjugates irregularities of ある correctly', () => {
    const verbInfo: VerbInfo = {verb: {kana: "ある", kanji: "有る"}, type: VerbType.Aru};

    const naiResult: Result = processAndGetConjugation(verbInfo, FormName.Negative) as Result;
    expect(naiResult.kana).toEqual('ない');
    expect(naiResult.kanji).toEqual('ない');

    const zuResult: Result = processAndGetConjugation(verbInfo, FormName.Zu) as Result;
    expect(zuResult.kana).toEqual('あらず');
    expect(zuResult.kanji).toEqual('有らず');
  });
  it('conjugates irregularities of 行く correctly', () => {
    const verbInfo: VerbInfo = {verb: {kana: "いく", kanji: "行く"}, type: VerbType.Iku};

    const teResult: Result = processAndGetConjugation(verbInfo, FormName.Te) as Result;
    expect(teResult.kana).toEqual('いって');
    expect(teResult.kanji).toEqual('行って');

    const taResult: Result = processAndGetConjugation(verbInfo, FormName.Past) as Result;
    expect(taResult.kana).toEqual('いった');
    expect(taResult.kanji).toEqual('行った');
  });
  it ('conjugates irregularities of 問う correctly', () => {
    const verbInfo: VerbInfo = {verb: {kana: "とう", kanji: "問う"}, type: VerbType.Tou};

    const teResult: Result = processAndGetConjugation(verbInfo, FormName.Te) as Result;
    expect(teResult.kana).toEqual('とうて');
    expect(teResult.kanji).toEqual('問うて');

    const taResult: Result = processAndGetConjugation(verbInfo, FormName.Past) as Result;
    expect(taResult.kana).toEqual('とうた');
    expect(taResult.kanji).toEqual('問うた');
  });
  it ('conjugates irregularities of くれる correctly', () => {
    const verbInfo: VerbInfo = {verb: {kana: "くれる", kanji: "呉れる"}, type: VerbType.Kureru};

    const result: Result = processAndGetConjugation(verbInfo, FormName.Imperative) as Result;
    expect(result.kana).toEqual('くれ');
    expect(result.kanji).toEqual('呉れ');
  });
  it('conjugates irregularities of irregular keigo verbs correctly', () => {
    const irassharuInfo: VerbInfo = {verb: {kana: "いらっしゃる"}, type: VerbType.Irassharu};
    const ossharuInfo: VerbInfo = {verb: {kana: "おっしゃる", kanji: "仰る"}, type: VerbType.Ossharu};
    const kudasaruInfo: VerbInfo = {verb: {kana: "くださる", kanji: "下さる"}, type: VerbType.Kudasaru};
    const gozaruInfo: VerbInfo = {verb: {kana: "ござる", kanji: "御座る"}, type: VerbType.Gozaru};
    const nasaruInfo: VerbInfo = {verb: {kana: "なさる", kanji: "為さる"}, type: VerbType.Irassharu};

    const irassharuResult: Result = processAndGetConjugation(irassharuInfo, FormName.Stem) as Result;
    const ossharuResult: Result = processAndGetConjugation(ossharuInfo, FormName.Stem) as Result;
    const kudasaruResult: Result = processAndGetConjugation(kudasaruInfo, FormName.Stem) as Result;
    const gozaruResult: Result = processAndGetConjugation(gozaruInfo, FormName.Stem) as Result;
    const nasaruResult: Result = processAndGetConjugation(nasaruInfo, FormName.Stem) as Result;

    expect(irassharuResult.kana).toEqual('いらっしゃい');
    expect(irassharuResult.kanji).toEqual(undefined);

    expect(ossharuResult.kana).toEqual('おっしゃい');
    expect(ossharuResult.kanji).toEqual('仰い');

    expect(kudasaruResult.kana).toEqual('ください');
    expect(kudasaruResult.kanji).toEqual('下さい');

    expect(gozaruResult.kana).toEqual('ござい');
    expect(gozaruResult.kanji).toEqual('御座い');

    expect(nasaruResult.kana).toEqual('なさい');
    expect(nasaruResult.kanji).toEqual('為さい');
  });
});*/




/* Expected results */

/*const miruConjugations: {form: FormName, expected: string[]}[] = [
  {form: FormName.Stem, expected: ["見", "み"]},
  {form: FormName.Present, expected: ["見る", "みる"]},
  {form: FormName.PresentPol, expected: ["見ます", "みます"]},
  {form: FormName.Negative, expected: ["見ない", "みない"]},
  {form: FormName.NegPol, expected: ["見ません", "みません"]},
  {form: FormName.Past, expected: ["見た", "みた"]},
  {form: FormName.PastPol, expected: ["見ました", "みました"]},
  {form: FormName.NegPast, expected: ["見なかった", "みなかった"]},
  {form: FormName.NegPastPol, expected: ["見ませんでした", "みませんでした"]},
  {form: FormName.Te, expected: ["見て", "みて"]},
  {form: FormName.NegTe, expected: ["見なくて", "みなくて"]},
  {form: FormName.Naide, expected: ["見ないで", "みないで"]},
  {form: FormName.Zu, expected: ["見ず", "みず"]},
  {form: FormName.PotentialFull, expected: ["見られる", "みられる"]},
  {form: FormName.PotentialShort, expected: ["見れる", "みれる"]},
  {form: FormName.NegPotentialFull, expected: ["見られない", "みられない"]},
  {form: FormName.NegPotentialShort, expected: ["見れない", "みれない"]},
  {form: FormName.Passive, expected: ["見られる", "みられる"]},
  {form: FormName.NegPassive, expected: ["見られない", "みられない"]},
  {form: FormName.Causative, expected: ["見させる", "みさせる"]},
  {form: FormName.NegCausative, expected: ["見させない", "みさせない"]},
  {form: FormName.CausPassive, expected: ["見させられる", "みさせられる"]},
  {form: FormName.NegCausPassive, expected: ["見させられない", "みさせられない"]},
  {form: FormName.Imperative, expected: ["見ろ", "みろ"]},
  {form: FormName.NegImperative, expected: ["見るな", "みるな"]},
  {form: FormName.Nasai, expected: ["見なさい", "みなさい"]},
  {form: FormName.Volitional, expected: ["見よう", "みよう"]},
  {form: FormName.VolitionalPol, expected: ["見ましょう", "みましょう"]},
  {form: FormName.BaConditional, expected: ["見れば", "みれば"]},
  {form: FormName.NegBaConditional, expected: ["見なければ", "みなければ"]},
  {form: FormName.TaraConditional, expected: ["見たら", "みたら"]},
  {form: FormName.NegTaraConditional, expected: ["見なかったら", "みなかったら"]}
]

const auConjugations: {form: FormName, expected: string[]}[] = [
  {form: FormName.Stem, expected: ["会い", "あい"]},
  {form: FormName.Present, expected: ["会う", "あう"]},
  {form: FormName.PresentPol, expected: ["会います", "あいます"]},
  {form: FormName.Negative, expected: ["会わない", "あわない"]},
  {form: FormName.NegPol, expected: ["会いません", "あいません"]},
  {form: FormName.Past, expected: ["会った", "あった"]},
  {form: FormName.PastPol, expected: ["会いました", "あいました"]},
  {form: FormName.NegPast, expected: ["会わなかった", "あわなかった"]},
  {form: FormName.NegPastPol, expected: ["会いませんでした", "あいませんでした"]},
  {form: FormName.Te, expected: ["会って", "あって"]},
  {form: FormName.NegTe, expected: ["会わなくて", "あわなくて"]},
  {form: FormName.Naide, expected: ["会わないで", "あわないで"]},
  {form: FormName.Zu, expected: ["会わず", "あわず"]},
  {form: FormName.PotentialFull, expected: ["会える", "あえる"]},
  {form: FormName.PotentialShort, expected: ["会える", "あえる"]},
  {form: FormName.NegPotentialFull, expected: ["会えない", "あえない"]},
  {form: FormName.NegPotentialShort, expected: ["会えない", "あえない"]},
  {form: FormName.Passive, expected: ["会われる", "あわれる"]},
  {form: FormName.NegPassive, expected: ["会われない", "あわれない"]},
  {form: FormName.Causative, expected: ["会わせる", "あわせる"]},
  {form: FormName.NegCausative, expected: ["会わせない", "あわせない"]},
  {form: FormName.CausPassive, expected: ["会わせられる", "あわせられる"]},
  {form: FormName.NegCausPassive, expected: ["会わせられない", "あわせられない"]},
  {form: FormName.Imperative, expected: ["会え", "あえ"]},
  {form: FormName.NegImperative, expected: ["会うな", "あうな"]},
  {form: FormName.Nasai, expected: ["会いなさい", "あいなさい"]},
  {form: FormName.Volitional, expected: ["会おう", "あおう"]},
  {form: FormName.VolitionalPol, expected: ["会いましょう", "あいましょう"]},
  {form: FormName.BaConditional, expected: ["会えば", "あえば"]},
  {form: FormName.NegBaConditional, expected: ["会わなければ", "あわなければ"]},
  {form: FormName.TaraConditional, expected: ["会ったら", "あったら"]},
  {form: FormName.NegTaraConditional, expected: ["会わなかったら", "あわなかったら"]}
]

const suruConjugations: {form: FormName, expected: string[]}[] = [
  {form: FormName.Stem, expected: ["為", "し"]},
  {form: FormName.Present, expected: ["為る", "する"]},
  {form: FormName.PresentPol, expected: ["為ます", "します"]},
  {form: FormName.Negative, expected: ["為ない", "しない"]},
  {form: FormName.NegPol, expected: ["為ません", "しません"]},
  {form: FormName.Past, expected: ["為た", "した"]},
  {form: FormName.PastPol, expected: ["為ました", "しました"]},
  {form: FormName.NegPast, expected: ["為なかった", "しなかった"]},
  {form: FormName.NegPastPol, expected: ["為ませんでした", "しませんでした"]},
  {form: FormName.Te, expected: ["為て", "して"]},
  {form: FormName.NegTe, expected: ["為なくて", "しなくて"]},
  {form: FormName.Naide, expected: ["為ないで", "しないで"]},
  {form: FormName.Zu, expected: ["為ず", "せず"]},
  {form: FormName.PotentialFull, expected: ["出来る", "できる"]},
  {form: FormName.PotentialShort, expected: ["出来る", "できる"]},
  {form: FormName.NegPotentialFull, expected: ["出来ない", "できない"]},
  {form: FormName.NegPotentialShort, expected: ["出来ない", "できない"]},
  {form: FormName.Passive, expected: ["為れる", "される"]},
  {form: FormName.NegPassive, expected: ["為れない", "されない"]},
  {form: FormName.Causative, expected: ["為せる", "させる"]},
  {form: FormName.NegCausative, expected: ["為せない", "させない"]},
  {form: FormName.CausPassive, expected: ["為せられる", "させられる"]},
  {form: FormName.NegCausPassive, expected: ["為せられない", "させられない"]},
  {form: FormName.Imperative, expected: ["為ろ", "しろ"]},
  {form: FormName.NegImperative, expected: ["為るな", "するな"]},
  {form: FormName.Nasai, expected: ["為なさい", "しなさい"]},
  {form: FormName.Volitional, expected: ["為よう", "しよう"]},
  {form: FormName.VolitionalPol, expected: ["為ましょう", "しましょう"]},
  {form: FormName.BaConditional, expected: ["為れば", "すれば"]},
  {form: FormName.NegBaConditional, expected: ["為なければ", "しなければ"]},
  {form: FormName.TaraConditional, expected: ["為たら", "したら"]},
  {form: FormName.NegTaraConditional, expected: ["為なかったら", "しなかったら"]}
]

const kuruConjugations: {form: FormName, expected: string[]}[] = [
  {form: FormName.Stem, expected: ["来", "き"]},
  {form: FormName.Present, expected: ["来る", "くる"]},
  {form: FormName.PresentPol, expected: ["来ます", "きます"]},
  {form: FormName.Negative, expected: ["来ない", "こない"]},
  {form: FormName.NegPol, expected: ["来ません", "きません"]},
  {form: FormName.Past, expected: ["来た", "きた"]},
  {form: FormName.PastPol, expected: ["来ました", "きました"]},
  {form: FormName.NegPast, expected: ["来なかった", "こなかった"]},
  {form: FormName.NegPastPol, expected: ["来ませんでした", "きませんでした"]},
  {form: FormName.Te, expected: ["来て", "きて"]},
  {form: FormName.NegTe, expected: ["来なくて", "こなくて"]},
  {form: FormName.Naide, expected: ["来ないで", "こないで"]},
  {form: FormName.Zu, expected: ["来ず", "こず"]},
  {form: FormName.PotentialFull, expected: ["来られる", "こられる"]},
  {form: FormName.PotentialShort, expected: ["来れる", "これる"]},
  {form: FormName.NegPotentialFull, expected: ["来られない", "こられない"]},
  {form: FormName.NegPotentialShort, expected: ["来れない", "これない"]},
  {form: FormName.Passive, expected: ["来られる", "こられる"]},
  {form: FormName.NegPassive, expected: ["来られない", "こられない"]},
  {form: FormName.Causative, expected: ["来させる", "こさせる"]},
  {form: FormName.NegCausative, expected: ["来させない", "こさせない"]},
  {form: FormName.CausPassive, expected: ["来させられる", "こさせられる"]},
  {form: FormName.NegCausPassive, expected: ["来させられない", "こさせられない"]},
  {form: FormName.Imperative, expected: ["来い", "こい"]},
  {form: FormName.NegImperative, expected: ["来るな", "くるな"]},
  {form: FormName.Nasai, expected: ["来なさい", "きなさい"]},
  {form: FormName.Volitional, expected: ["来よう", "こよう"]},
  {form: FormName.VolitionalPol, expected: ["来ましょう", "きましょう"]},
  {form: FormName.BaConditional, expected: ["来れば", "くれば"]},
  {form: FormName.NegBaConditional, expected: ["来なければ", "こなければ"]},
  {form: FormName.TaraConditional, expected: ["来たら", "きたら"]},
  {form: FormName.NegTaraConditional, expected: ["来なかったら", "こなかったら"]}
]*/