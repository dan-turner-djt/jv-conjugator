

import { VerbType } from "../../Defs/VerbDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { getPotentialForm } from "./AuxForms";

import Stems = require("../Stems/Stems");

describe("Potential form", () => {
  const spy_getStems = jest.spyOn(Stems, "getStems");

  it("conjugates Ichidan verbs correctly", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "たべ", kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "られ"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "れ"});
  });
  it("conjugates Godan verbs correctly", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "あ", kanji: "会"}, endingChar: "う", type: VerbType.Godan, irregular: false};

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 2);
    expect(result).toEqual({suffix: "え"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 2);
    expect(result).toEqual({suffix: "え"});
  });
  it("conjugates する correctly", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "す", kanji: "為"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Suru};

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "", newKanaRawStem: "でき", newKanjiRawStem: "出来"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "", newKanaRawStem: "でき", newKanjiRawStem: "出来"});
  });
  it("conjugates 来る correctly", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "く", kanji: "来"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Kuru};

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
    expect(result).toEqual({suffix: "られ", newKanaRawStem: "こ"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
    expect(result).toEqual({suffix: "れ", newKanaRawStem: "こ"});
  });
});