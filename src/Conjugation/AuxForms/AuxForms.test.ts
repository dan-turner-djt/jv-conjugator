

import { VerbType } from "../../Defs/VerbDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { PassCausForms, getAndProcessAuxForm, getChauForm, getPassCausForms, getPotentialForm } from "./AuxForms";
import { AuxiliaryFormName } from "../../Defs/VerbFormDefs";
import { commonVerbInfo } from "../../TestUtils/CommonVerbInfo";

import Stems = require("../Stems/Stems");
import TForms = require("../TForms/TForms");

describe("Potential form", () => {
  const spy_getStems = jest.spyOn(Stems, "getStems");

  it("conjugates Ichidan verbs correctly", () => {
    const verbInfo: ProcessedVerbInfo = commonVerbInfo.taberuVerbInfo;

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "られ"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "れ"});
  });
  it("conjugates Godan verbs correctly", () => {
    const verbInfo: ProcessedVerbInfo = commonVerbInfo.auVerbInfo;

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 2);
    expect(result).toEqual({suffix: "え"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 2);
    expect(result).toEqual({suffix: "え"});
  });
  it("conjugates する correctly", () => {
    const verbInfo: ProcessedVerbInfo = commonVerbInfo.suruVerbInfo;

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "", newKanaRawStem: "でき", newKanjiRawStem: "出来"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "", newKanaRawStem: "でき", newKanjiRawStem: "出来"});
  });
  it("conjugates 来る correctly", () => {
    const verbInfo: ProcessedVerbInfo = commonVerbInfo.kuruVerbInfo;

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
    expect(result).toEqual({suffix: "られ", newKanaRawStem: "こ"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
    expect(result).toEqual({suffix: "れ", newKanaRawStem: "こ"});
  });
});

describe("Passive, causative and causative-passive forms", () => {
  const spy_getStems = jest.spyOn(Stems, "getStems");

  describe("Passive form", () => {
    it("conjugates Ichidan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.taberuVerbInfo;

      const result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.Pass, false);
      expect(spy_getStems).not.toHaveBeenCalled();
      expect(result).toEqual({result: {suffix: "られ"}, newEndingChar: "る"});
    });
    it("conjugates Godan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.auVerbInfo;

      const result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.Pass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "われ"}, newEndingChar: "る"});
    });
    it("conjugates する correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.suruVerbInfo;

      const result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.Pass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "れ", newKanaRawStem: "さ"}, newEndingChar: "る"});
    });
    it("conjugates 来る correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.kuruVerbInfo;

      const result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.Pass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
      expect(result).toEqual({result: {suffix: "られ", newKanaRawStem: "こ"}, newEndingChar: "る"});
    });
  });

  describe("Causative form", () => {
    it("conjugates Ichidan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.taberuVerbInfo;

      let result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.Caus, false);
      expect(spy_getStems).not.toHaveBeenCalled();
      expect(result).toEqual({result: {suffix: "させ"}, newEndingChar: "る"});

      result = getPassCausForms(verbInfo, PassCausForms.Caus, true);
      expect(spy_getStems).not.toHaveBeenCalled();
      expect(result).toEqual({result: {suffix: "さ"}, newEndingChar: "す"});
    });
    it("conjugates Godan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.auVerbInfo;

      let result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.Caus, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "わせ"}, newEndingChar: "る"});

      result = getPassCausForms(verbInfo, PassCausForms.Caus, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "わ"}, newEndingChar: "す"});
    });
    it("conjugates する correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.suruVerbInfo;

      let result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.Caus, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "せ", newKanaRawStem: "さ"}, newEndingChar: "る"});

      result = getPassCausForms(verbInfo, PassCausForms.Caus, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "", newKanaRawStem: "さ"}, newEndingChar: "す"});
    });
    it("conjugates 来る correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.kuruVerbInfo;

      let result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.Caus, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
      expect(result).toEqual({result: {suffix: "させ", newKanaRawStem: "こ"}, newEndingChar: "る"});

      result = getPassCausForms(verbInfo, PassCausForms.Caus, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
      expect(result).toEqual({result: {suffix: "さ", newKanaRawStem: "こ"}, newEndingChar: "す"});
    });
  });

  describe("Casuative-passive form", () => {
    it("conjugates Ichidan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.taberuVerbInfo;

      let result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.CausPass, false);
      expect(spy_getStems).not.toHaveBeenCalled();
      expect(result).toEqual({result: {suffix: "させられ"}, newEndingChar: "る"});

      result = getPassCausForms(verbInfo, PassCausForms.CausPass, true);
      expect(spy_getStems).not.toHaveBeenCalled();
      expect(result).toEqual({result: {suffix: "させられ"}, newEndingChar: "る"});
    });
    it("conjugates Godan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.auVerbInfo;

      let result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.CausPass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "わせられ"}, newEndingChar: "る"});

      result = getPassCausForms(verbInfo, PassCausForms.CausPass, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "わされ"}, newEndingChar: "る"});

      const suVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "さ", kanji: "指"}, endingChar: "す", type: VerbType.Godan, irregular: false};
      result = getPassCausForms(suVerbInfo, PassCausForms.CausPass, true);
      expect(spy_getStems).toHaveBeenCalledWith(suVerbInfo, 0);
      expect(result).toEqual({result: {suffix: "させられ"}, newEndingChar: "る"});
    });
    it("conjugates する correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.suruVerbInfo;

      let result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.CausPass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "せられ", newKanaRawStem: "さ"}, newEndingChar: "る"});

      result = getPassCausForms(verbInfo, PassCausForms.CausPass, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "せられ", newKanaRawStem: "さ"}, newEndingChar: "る"});
    });
    it("conjugates 来る correctly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.kuruVerbInfo;

      let result: {result: ConjugationResult, newEndingChar: string} | Error = getPassCausForms(verbInfo, PassCausForms.CausPass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
      expect(result).toEqual({result: {suffix: "させられ", newKanaRawStem: "こ"}, newEndingChar: "る"});

      result = getPassCausForms(verbInfo, PassCausForms.CausPass, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
      expect(result).toEqual({result: {suffix: "させられ", newKanaRawStem: "こ"}, newEndingChar: "る"});
    });
  });

  describe("Get Chau form", () => {
    const spy_getTForm = jest.spyOn(TForms, "getTForm");
    it("conjugates with た ending properly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.taberuVerbInfo;
      const result: ConjugationResult | Error = getChauForm(verbInfo);
      expect(spy_getTForm).toHaveBeenCalledWith(verbInfo, false);
      expect(result).toEqual({suffix: "ちゃ"});
    });
    it("conjugates with だ ending properly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.nomuVerbInfo;
      const result: ConjugationResult | Error = getChauForm(verbInfo);
      expect(spy_getTForm).toHaveBeenCalledWith(verbInfo, false);
      expect(result).toEqual({suffix: "んじゃ"});
    });
    it("conjugates する properly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.suruVerbInfo;
      const result: ConjugationResult | Error = getChauForm(verbInfo);
      expect(spy_getTForm).toHaveBeenCalledWith(verbInfo, false);
      expect(result).toEqual({suffix: "ちゃ", newKanaRawStem: "し"});
    });
  });

  describe("Get and process Aux Forms", () => {
    it("handles る ending results properly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.taberuVerbInfo;
      const result: ProcessedVerbInfo | Error = getAndProcessAuxForm(verbInfo, AuxiliaryFormName.Passive, false);
      expect(result).toEqual({rawStem: {kana: "たべられ", kanji: "食べられ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false});
    })
    it("handles す ending results properly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.auVerbInfo;
      const result: ProcessedVerbInfo | Error = getAndProcessAuxForm(verbInfo, AuxiliaryFormName.Causative, true);
      expect(result).toEqual({rawStem: {kana: "あわ", kanji: "会わ"}, endingChar: "す", type: VerbType.Godan, irregular: false});
    })
    it("handles う ending results properly", () => {
      const verbInfo: ProcessedVerbInfo = commonVerbInfo.auVerbInfo;
      const result: ProcessedVerbInfo | Error = getAndProcessAuxForm(verbInfo, AuxiliaryFormName.Chau, true);
      expect(result).toEqual({rawStem: {kana: "あっちゃ", kanji: "会っちゃ"}, endingChar: "う", type: VerbType.Godan, irregular: false});
    })
    it("only returns new stems and suffixes if the stems were already defined", () => {
      const kanaOnlyVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "たべ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
      let result: ProcessedVerbInfo | Error = getAndProcessAuxForm(kanaOnlyVerbInfo, AuxiliaryFormName.Passive, false);
      expect(result).toEqual({
        rawStem: {kana: "たべられ", kanji: undefined},
        endingChar: "る", type: VerbType.Ichidan, irregular: false
      })
  
      const kanjiOnlyVerbInfo: ProcessedVerbInfo = {rawStem: {kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
      result = getAndProcessAuxForm(kanjiOnlyVerbInfo, AuxiliaryFormName.Passive, false);
      expect(result).toEqual({
        rawStem: {kana: undefined, kanji: "食べられ"},
        endingChar: "る", type: VerbType.Ichidan, irregular: false
      })
    });
  });
});