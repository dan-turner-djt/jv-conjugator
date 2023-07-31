import { ErrorMessages } from "./Defs/ErrorMessages";
import { VerbInfo, VerbType } from "./Defs/VerbDefs";
import { FormInfo, FormName } from "./Defs/VerbFormDefs";
import { conjugateVerb } from "./Driver";
import { Result } from "./Process/Process";

describe("E2E all forms", () => {
  const verbInfo: VerbInfo = {verb: {kana: "する", kanji: "為る"}, type: VerbType.Suru};

  function testForm(formInfo: FormInfo, expected: Result | Error) {
    const result: Result | Error = conjugateVerb(verbInfo, formInfo);
    expect(result).toEqual(expected);
  }

  it("conjugates all plain forms correctly", () => {
    testForm({formName: FormName.Stem}, {kana: "し", kanji: "為"});
    testForm({formName: FormName.Stem, negative: true}, new Error(ErrorMessages.NoNegativeForm));

    testForm({formName: FormName.Present}, {kana: "する", kanji: "為る"});
    testForm({formName: FormName.Present, negative: true}, {kana: "しない", kanji: "為ない"});

    testForm({formName: FormName.Past}, {kana: "した", kanji: "為た"});
    testForm({formName: FormName.Past, negative: true}, {kana: "しなかった", kanji: "為なかった"});

    testForm({formName: FormName.Te}, {kana: "して", kanji: "為て"});
    testForm({formName: FormName.Te, negative: true}, {kana: "しなくて", kanji: "為なくて"});

    testForm({formName: FormName.Imperative}, {kana: "しろ", kanji: "為ろ"});
    testForm({formName: FormName.Imperative, negative: true}, {kana: "するな", kanji: "為るな"});

    testForm({formName: FormName.Volitional}, {kana: "しよう", kanji: "為よう"});
    testForm({formName: FormName.Volitional, negative: true}, {kana: "しなかろう", kanji: "為なかろう"});

    testForm({formName: FormName.BaConditional}, {kana: "すれば", kanji: "為れば"});
    testForm({formName: FormName.BaConditional, negative: true}, {kana: "しなければ", kanji: "為なければ"});

    testForm({formName: FormName.TaraConditional}, {kana: "したら", kanji: "為たら"});
    testForm({formName: FormName.TaraConditional, negative: true}, {kana: "しなかったら", kanji: "為なかったら"});

    testForm({formName: FormName.Zu}, {kana: "せず", kanji: "為ず"});
    testForm({formName: FormName.Zu, negative: true}, new Error(ErrorMessages.NoNegativeForm));

    testForm({formName: FormName.Naide}, {kana: "しないで", kanji: "為ないで"});
    testForm({formName: FormName.Naide, negative: true}, new Error(ErrorMessages.NoNegativeForm));

    testForm({formName: FormName.Tai}, {kana: "したい", kanji: "為たい"});
    testForm({formName: FormName.Tai, negative: true}, {kana: "したくない", kanji: "為たくない"});
  });

  it("conjugates all polite forms correctly", () => {
    testForm({polite: true, formName: FormName.Stem}, new Error(ErrorMessages.NoPoliteForm));
    testForm({polite: true, formName: FormName.Stem, negative: true}, new Error(ErrorMessages.NoPoliteForm));

    testForm({polite: true, formName: FormName.Present}, {kana: "します", kanji: "為ます"});
    testForm({polite: true, formName: FormName.Present, negative: true}, {kana: "しません", kanji: "為ません"});

    testForm({polite: true, formName: FormName.Past}, {kana: "しました", kanji: "為ました"});
    testForm({polite: true, formName: FormName.Past, negative: true}, {kana: "しませんでした", kanji: "為ませんでした"});

    testForm({polite: true, formName: FormName.Te}, {kana: "しまして", kanji: "為まして"});
    testForm({polite: true, formName: FormName.Te, negative: true}, {kana: "しませんで", kanji: "為ませんで"});

    testForm({polite: true, formName: FormName.Imperative}, {kana: "しなさい", kanji: "為なさい"});
    testForm({polite: true, formName: FormName.Imperative, negative: true}, new Error(ErrorMessages.NoNegativeForm));

    testForm({polite: true, formName: FormName.Volitional}, {kana: "しましょう", kanji: "為ましょう"});
    testForm({polite: true, formName: FormName.Volitional, negative: true}, new Error(ErrorMessages.NoNegativeForm));

    testForm({polite: true, formName: FormName.BaConditional}, {kana: "しますれば", kanji: "為ますれば"});
    testForm({polite: true, formName: FormName.BaConditional, shortVer: true}, {kana: "しませば", kanji: "為ませば"});
    testForm({polite: true, formName: FormName.BaConditional, negative: true}, new Error(ErrorMessages.NoNegativeForm));

    testForm({polite: true, formName: FormName.TaraConditional}, {kana: "しましたら", kanji: "為ましたら"});
    testForm({polite: true, formName: FormName.TaraConditional, negative: true}, {kana: "しませんでしたら", kanji: "為ませんでしたら"});

    testForm({polite: true, formName: FormName.Zu}, new Error(ErrorMessages.NoPoliteForm));
    testForm({polite: true, formName: FormName.Zu, negative: true}, new Error(ErrorMessages.NoPoliteForm));

    testForm({polite: true, formName: FormName.Naide}, {kana: "しませんで", kanji: "為ませんで"});
    testForm({polite: true, formName: FormName.Naide, negative: true}, new Error(ErrorMessages.NoNegativeForm));

    testForm({polite: true, formName: FormName.Tai}, {kana: "したいです", kanji: "為たいです"});
    testForm({polite: true, formName: FormName.Tai, negative: true}, {kana: "したくないです", kanji: "為たくないです"});
  });
});