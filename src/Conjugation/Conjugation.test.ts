import { ConjugationResult, ProcessedVerbInfo, processAndGetConjugation, processConjugationResult, processVerbInfo } from "./Conjugation"
import { IrregularVerbs, VerbInfo, VerbType } from "./VerbDefs"
import { FormName } from "./VerbFormDefs";

it('processes verb info properly', () => {
  const rawVerbInfoTaberu: VerbInfo = {verb: {kanji: "食べる", kana: "たべる"}, type: VerbType.Ichidan, irregular: false};
  const processedVerbInfo: ProcessedVerbInfo = processVerbInfo(rawVerbInfoTaberu);
  expect(processedVerbInfo).toEqual(
    {rawStem: {kanji: "食べ", kana: "たべ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false}
  )
});

describe('Process conjugation results', () => {
  it('processes the basic suffix properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kanji: "食べ", kana: "たべ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
    const conjugationResult: ConjugationResult = {suffix: "ない"};
    const results: string[] = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(results).toEqual(["食べない", "たべない"]); 
  });

  it('processes the suffix and new kana and kanji stems properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kanji: "為", kana: "す"}, endingChar: "る", type: VerbType.Ichidan, irregular: IrregularVerbs.Suru};
    const conjugationResult: ConjugationResult = {suffix: "ない", newKanjiRawStem: "出来", newKanaRawStem: "でき"};
    const results: string[] = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(results).toEqual(["出来ない", "できない"]); 
  });

  it('processes full info with kudasai properly', () => {
    const proceesedVerbInfo: ProcessedVerbInfo = {rawStem: {kanji: "為", kana: "す"}, endingChar: "る", type: VerbType.Ichidan, irregular: IrregularVerbs.Suru};
    const conjugationResult: ConjugationResult = {suffix: "ないで", newKanjiRawStem: "出来", newKanaRawStem: "でき", kudasai: true};
    const results: string[] = processConjugationResult(conjugationResult, proceesedVerbInfo);
    expect(results).toEqual(["出来ないで下さい", "出来ないでください", "できないで下さい", "できないでください"]);
  });
});


describe('Ichidan conjugation', () => {
  it ('conjugates 見る correctly', () => {
    const verbInfo: VerbInfo = {verb: {kanji: "見る", kana: "みる"}, type: VerbType.Ichidan, irregular: false};

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const results: string[] = processAndGetConjugation(verbInfo, Number(value));
      const expected = miruConjugations.find(o => o.form === Number(value))?.expected;
      expect(results).toEqual(expected);
    }
  });
})

describe('Godan conjugation', () => {
  it ('conjugates 会う correctly', () => {
    const verbInfo: VerbInfo = {verb: {kanji: "会う", kana: "あう"}, type: VerbType.Godan, irregular: false};

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const results: string[] = processAndGetConjugation(verbInfo, Number(value));
      const expected = auConjugations.find(o => o.form === Number(value))?.expected;
      expect(results).toEqual(expected);
    }
  });
})

describe('Irregular conjugation', () => {
  it ('conjugates する correctly', () => {
    const verbInfo: VerbInfo = {verb: {kanji: "為る", kana: "する"}, type: VerbType.Ichidan, irregular: IrregularVerbs.Suru};

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const results: string[] = processAndGetConjugation(verbInfo, Number(value));
      const expected = suruConjugations.find(o => o.form === Number(value))?.expected;
      expect(results).toEqual(expected);
    }
  });
  it ('conjugates くる correctly', () => {
    const verbInfo: VerbInfo = {verb: {kanji: "来る", kana: "くる"}, type: VerbType.Ichidan, irregular: IrregularVerbs.Kuru};

    for (const value in FormName) {
      if (isNaN(Number(value))) return;
      const results: string[] = processAndGetConjugation(verbInfo, Number(value));
      const expected = kuruConjugations.find(o => o.form === Number(value))?.expected;
      expect(results).toEqual(expected);
    }
  });
  it ('conjugates irregularities of ある correctly', () => {
    const verbInfo: VerbInfo = {verb: {kanji: "有る", kana: "ある"}, type: VerbType.Godan, irregular: IrregularVerbs.Aru};

    const naiResults = processAndGetConjugation(verbInfo, FormName.Negative);
    expect(naiResults).toEqual(['ない', 'ない']);

    const zuResults = processAndGetConjugation(verbInfo, FormName.Zu);
    expect(zuResults).toEqual(['有らず', 'あらず']);
  });
  it ('conjugates irregularities of 行く correctly', () => {
    const verbInfo: VerbInfo = {verb: {kanji: "行く", kana: "いく"}, type: VerbType.Godan, irregular: IrregularVerbs.Iku};

    const teResults = processAndGetConjugation(verbInfo, FormName.Te);
    expect(teResults).toEqual(['行って', 'いって']);

    const taResults = processAndGetConjugation(verbInfo, FormName.Past);
    expect(taResults).toEqual(['行った', 'いった']);
  });
  it ('conjugates irregularities of 問う correctly', () => {
    const verbInfo: VerbInfo = {verb: {kanji: "問う", kana: "とう"}, type: VerbType.Godan, irregular: IrregularVerbs.Tou};

    const teResults = processAndGetConjugation(verbInfo, FormName.Te);
    expect(teResults).toEqual(['問うて', 'とうて']);

    const taResults = processAndGetConjugation(verbInfo, FormName.Past);
    expect(taResults).toEqual(['問うた', 'とうた']);
  });
  it ('conjugates irregularities of くれる correctly', () => {
    const verbInfo: VerbInfo = {verb: {kanji: "呉れる", kana: "くれる"}, type: VerbType.Ichidan, irregular: IrregularVerbs.Kureru};

    const results = processAndGetConjugation(verbInfo, FormName.Imperative);
    expect(results).toEqual(['呉れ', 'くれ']);
  });
  it ('conjugates irregularities of irregular keigo verbs correctly', () => {
    const irassharuInfo: VerbInfo = {verb: {kanji: "いらっしゃる", kana: "いらっしゃる"}, type: VerbType.Godan, irregular: IrregularVerbs.Irassharu};
    const ossharuInfo: VerbInfo = {verb: {kanji: "仰る", kana: "おっしゃる"}, type: VerbType.Godan, irregular: IrregularVerbs.Ossharu};
    const kudasaruInfo: VerbInfo = {verb: {kanji: "下さる", kana: "くださる"}, type: VerbType.Godan, irregular: IrregularVerbs.Kudasaru};
    const gozaruInfo: VerbInfo = {verb: {kanji: "御座る", kana: "ござる"}, type: VerbType.Godan, irregular: IrregularVerbs.Gozaru};
    const nasaruInfo: VerbInfo = {verb: {kanji: "為さる", kana: "なさる"}, type: VerbType.Godan, irregular: IrregularVerbs.Irassharu};

    const irassharuResults = processAndGetConjugation(irassharuInfo, FormName.Stem);
    const ossharuResults = processAndGetConjugation(ossharuInfo, FormName.Stem);
    const kudasaruResults = processAndGetConjugation(kudasaruInfo, FormName.Stem);
    const gozaruResults = processAndGetConjugation(gozaruInfo, FormName.Stem);
    const nasaruResults = processAndGetConjugation(nasaruInfo, FormName.Stem);

    expect(irassharuResults).toEqual(['いらっしゃい', 'いらっしゃい']);
    expect(ossharuResults).toEqual(['仰い', 'おっしゃい']);
    expect(kudasaruResults).toEqual(['下さい', 'ください']);
    expect(gozaruResults).toEqual(['御座い', 'ござい']);
    expect(nasaruResults).toEqual(['為さい', 'なさい']);
  });
})




/* Expected results */

const miruConjugations: {form: FormName, expected: string[]}[] = [
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
  {form: FormName.TeReq, expected: ["見て下さい", "見てください", "みて下さい", "みてください"]},
  {form: FormName.NegTe, expected: ["見なくて", "みなくて"]},
  {form: FormName.NegReq, expected: ["見ないで下さい", "見ないでください", "みないで下さい", "みないでください"]},
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
  {form: FormName.TeReq, expected: ["会って下さい", "会ってください", "あって下さい", "あってください"]},
  {form: FormName.NegTe, expected: ["会わなくて", "あわなくて"]},
  {form: FormName.NegReq, expected: ["会わないで下さい", "会わないでください", "あわないで下さい", "あわないでください"]},
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
  {form: FormName.TeReq, expected: ["為て下さい", "為てください", "して下さい", "してください"]},
  {form: FormName.NegTe, expected: ["為なくて", "しなくて"]},
  {form: FormName.NegReq, expected: ["為ないで下さい", "為ないでください", "しないで下さい", "しないでください"]},
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
  {form: FormName.TeReq, expected: ["来て下さい", "来てください", "きて下さい", "きてください"]},
  {form: FormName.NegTe, expected: ["来なくて", "こなくて"]},
  {form: FormName.NegReq, expected: ["来ないで下さい", "来ないでください", "こないで下さい", "こないでください"]},
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
]