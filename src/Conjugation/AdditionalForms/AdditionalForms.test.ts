
import { VerbType } from "../../Defs/VerbDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { getAdditionalForm } from "./AdditionalForms";

import TForms = require("../TForms/TForms");
import { AdditionalFormName } from "../../Defs/VerbFormDefs";

describe("Additional forms", () => {
  const spy_getTForm = jest.spyOn(TForms, "getTForm");
  const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "たべ", kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
  const teForm = {kana: "たべて", kanji: "食べて"}; 

  function testAdditionalForm(verbInfo: ProcessedVerbInfo, form: AdditionalFormName, shortVer: boolean, expected: ProcessedVerbInfo) {
    const result: ProcessedVerbInfo | Error = getAdditionalForm(verbInfo, form, shortVer);
    expect(spy_getTForm).toHaveBeenCalledWith(verbInfo, true);
    expect(result).toEqual(expected);
  }

  it("gets the Continuous form correctly", () => {
    testAdditionalForm(verbInfo, AdditionalFormName.Continuous, false, {
      rawStem: {kana: teForm.kana + "い", kanji: teForm.kanji + "い"},
      endingChar: "る", type: VerbType.Ichidan, irregular: false
    });

    testAdditionalForm(verbInfo, AdditionalFormName.Continuous, true, {
      rawStem: {kana: teForm.kana, kanji: teForm.kanji},
      endingChar: "る", type: VerbType.Ichidan, irregular: false
    });
  });
  it("gets the TeAru form correctly", () => {
    const expected: ProcessedVerbInfo = {
      rawStem: {kana: teForm.kana + "あ", kanji: teForm.kanji + "あ"},
      endingChar: "る", type: VerbType.Godan, irregular: VerbType.Aru
    }

    testAdditionalForm(verbInfo, AdditionalFormName.TeAru, false, expected);
    testAdditionalForm(verbInfo, AdditionalFormName.TeAru, true, expected);
  });
  it("gets the TeOku form correctly", () => {
    testAdditionalForm(verbInfo, AdditionalFormName.TeOku, false, {
      rawStem: {kana: teForm.kana + "お", kanji: teForm.kanji + "お"},
      endingChar: "く", type: VerbType.Godan, irregular: false
    });

    testAdditionalForm(verbInfo, AdditionalFormName.TeOku, true, {
      rawStem: {kana: "たべと", kanji: "食べと"},
      endingChar: "く", type: VerbType.Godan, irregular: false
    });

    const deVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "し", kanji: "死"}, endingChar: "ぬ", type: VerbType.Godan, irregular: false};
    const deExpected: ProcessedVerbInfo = {
      rawStem: {kana: "しんど", kanji: "死んど"},
      endingChar: "く", type: VerbType.Godan, irregular: false
    };

    const result: ProcessedVerbInfo | Error = getAdditionalForm(deVerbInfo, AdditionalFormName.TeOku, true);
    expect(spy_getTForm).toHaveBeenCalledWith(deVerbInfo, true);
    expect(result).toEqual(deExpected);
  });
  it("gets the TeIku form correctly", () => {
    const expected: ProcessedVerbInfo = {
      rawStem: {kana: teForm.kana + "い", kanji: teForm.kanji + "い"},
      endingChar: "く", type: VerbType.Godan, irregular: VerbType.Iku
    }

    testAdditionalForm(verbInfo, AdditionalFormName.TeIku, false, expected);
    testAdditionalForm(verbInfo, AdditionalFormName.TeIku, true, expected);
  });
  it("gets the TeKuru form correctly", () => {
    const expected: ProcessedVerbInfo = {
      rawStem: {kana: teForm.kana + "く", kanji: teForm.kanji + "く"},
      endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Kuru
    }

    testAdditionalForm(verbInfo, AdditionalFormName.TeKuru, false, expected);
    testAdditionalForm(verbInfo, AdditionalFormName.TeKuru, true, expected);
  });
  it("gets the TeAgeru form correctly", () => {
    const expected: ProcessedVerbInfo = {
      rawStem: {kana: teForm.kana + "あげ", kanji: teForm.kanji + "あげ"},
      endingChar: "る", type: VerbType.Ichidan, irregular: false
    }

    testAdditionalForm(verbInfo, AdditionalFormName.TeAgeru, false, expected);
    testAdditionalForm(verbInfo, AdditionalFormName.TeAgeru, true, expected);
  });
  it("gets the TeKureru form correctly", () => {
    const expected: ProcessedVerbInfo = {
      rawStem: {kana: teForm.kana + "くれ", kanji: teForm.kanji + "くれ"},
      endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Kureru
    }

    testAdditionalForm(verbInfo, AdditionalFormName.TeKureru, false, expected);
    testAdditionalForm(verbInfo, AdditionalFormName.TeKureru, true, expected);
  });
  it("gets the TeMorau form correctly", () => {
    const expected: ProcessedVerbInfo = {
      rawStem: {kana: teForm.kana + "もら", kanji: teForm.kanji + "もら"},
      endingChar: "う", type: VerbType.Godan, irregular: false
    }

    testAdditionalForm(verbInfo, AdditionalFormName.TeMorau, false, expected);
    testAdditionalForm(verbInfo, AdditionalFormName.TeMorau, true, expected);
  });
  it("only returns new stems and suffixes if the stems were already defined", () => {
    const kanaOnlyVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "たべ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
    
    testAdditionalForm(kanaOnlyVerbInfo, AdditionalFormName.Continuous, false, {
      rawStem: {kana: teForm.kana + "い", kanji: undefined},
      endingChar: "る", type: VerbType.Ichidan, irregular: false
    });

    const kanjiOnlyVerbInfo: ProcessedVerbInfo = {rawStem: {kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};

    testAdditionalForm(kanjiOnlyVerbInfo, AdditionalFormName.Continuous, true, {
      rawStem: {kana: undefined, kanji: teForm.kanji},
      endingChar: "る", type: VerbType.Ichidan, irregular: false
    });
  });

});