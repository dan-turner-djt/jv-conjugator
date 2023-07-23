
import { VerbType } from "../../Defs/VerbDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { NegativeForms, getNegativeForm, getNegativeStem } from "./NegativeForms";

import Stems = require("../Stems/Stems");

describe("Negative stem", () => {
  const spy_getStems = jest.spyOn(Stems, "getStems");

  it("conjugates Ichidan verbs correctly", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "たべ", kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
    const result: ConjugationResult | Error = getNegativeStem(verbInfo);
    expect(result).toEqual({suffix: "な"});
  });
  it("conjugates Godan verbs correctly", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "あ", kanji: "会"}, endingChar: "う", type: VerbType.Godan, irregular: false};
    const result: ConjugationResult | Error = getNegativeStem(verbInfo);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
    expect(result).toEqual({suffix: "わ" + "な"});
  });
  it("conjugates ある correctly", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "あ", kanji: "有"}, endingChar: "る", type: VerbType.Godan, irregular: VerbType.Aru};
    const result: ConjugationResult | Error = getNegativeStem(verbInfo);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "な", newKanaRawStem: "", newKanjiRawStem: ""});
  });
  it("conjugates する correctly", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "す", kanji: "為"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Suru};
    const result: ConjugationResult | Error = getNegativeStem(verbInfo);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 1);
    expect(result).toEqual({suffix: "な", newKanaRawStem: "し"});
  });
  it("conjugates 来る correctly", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "く", kanji: "来"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Kuru};
    const result: ConjugationResult | Error = getNegativeStem(verbInfo);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
    expect(result).toEqual({suffix: "な", newKanaRawStem: "こ"});
  });
});

describe("Negative forms", () => {
  const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "あ", kanji: "会"}, endingChar: "う", type: VerbType.Godan, irregular: false};
  
  function testNegativeForms(form: NegativeForms, expected: string, zu = false) {
    const result: ConjugationResult | Error = getNegativeForm(verbInfo, form);
    expect(result).toEqual({suffix: (zu? "わ" : "わな") + expected});
  }

  it("conjugates correctly", () => {
    testNegativeForms(NegativeForms.Nai, "い");
    testNegativeForms(NegativeForms.Nakute, "くて");
    testNegativeForms(NegativeForms.Nakatta, "かった");
    testNegativeForms(NegativeForms.Naide, "いで");
    testNegativeForms(NegativeForms.Nakereba, "ければ");
    testNegativeForms(NegativeForms.Nakattara, "かったら");
    testNegativeForms(NegativeForms.Nakarou, "かろう");
    testNegativeForms(NegativeForms.Zu, "ず", true);
  });
});