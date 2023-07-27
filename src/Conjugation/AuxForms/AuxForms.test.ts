

import { VerbType } from "../../Defs/VerbDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { PassCausForms, getAndProcessAuxForm, getPassCausForms, getPotentialForm } from "./AuxForms";
import { AuxiliaryFormName } from "../../Defs/VerbFormDefs";

import Stems = require("../Stems/Stems");

const taberuVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "たべ", kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};
const auVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "あ", kanji: "会"}, endingChar: "う", type: VerbType.Godan, irregular: false};
const suruVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "す", kanji: "為"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Suru};
const kuruVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "く", kanji: "来"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Kuru};

describe("Potential form", () => {
  const spy_getStems = jest.spyOn(Stems, "getStems");

  it("conjugates Ichidan verbs correctly", () => {
    const verbInfo: ProcessedVerbInfo = taberuVerbInfo;

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "られ"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "れ"});
  });
  it("conjugates Godan verbs correctly", () => {
    const verbInfo: ProcessedVerbInfo = auVerbInfo;

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 2);
    expect(result).toEqual({suffix: "え"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 2);
    expect(result).toEqual({suffix: "え"});
  });
  it("conjugates する correctly", () => {
    const verbInfo: ProcessedVerbInfo = suruVerbInfo;

    let result: ConjugationResult | Error = getPotentialForm(verbInfo, false);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "", newKanaRawStem: "でき", newKanjiRawStem: "出来"});

    result = getPotentialForm(verbInfo, true);
    expect(spy_getStems).not.toHaveBeenCalled();
    expect(result).toEqual({suffix: "", newKanaRawStem: "でき", newKanjiRawStem: "出来"});
  });
  it("conjugates 来る correctly", () => {
    const verbInfo: ProcessedVerbInfo = kuruVerbInfo;

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
      const verbInfo: ProcessedVerbInfo = taberuVerbInfo;

      const result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.Pass, false);
      expect(spy_getStems).not.toHaveBeenCalled();
      expect(result).toEqual({result: {suffix: "られ"}, nowSu: false});
    });
    it("conjugates Godan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = auVerbInfo;

      const result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.Pass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "われ"}, nowSu: false});
    });
    it("conjugates する correctly", () => {
      const verbInfo: ProcessedVerbInfo = suruVerbInfo;

      const result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.Pass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "れ", newKanaRawStem: "さ"}, nowSu: false});
    });
    it("conjugates 来る correctly", () => {
      const verbInfo: ProcessedVerbInfo = kuruVerbInfo;

      const result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.Pass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
      expect(result).toEqual({result: {suffix: "られ", newKanaRawStem: "こ"}, nowSu: false});
    });
  });

  describe("Causative form", () => {
    it("conjugates Ichidan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = taberuVerbInfo;

      let result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.Caus, false);
      expect(spy_getStems).not.toHaveBeenCalled();
      expect(result).toEqual({result: {suffix: "させ"}, nowSu: false});

      result = getPassCausForms(verbInfo, PassCausForms.Caus, true);
      expect(spy_getStems).not.toHaveBeenCalled();
      expect(result).toEqual({result: {suffix: "さ"}, nowSu: true});
    });
    it("conjugates Godan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = auVerbInfo;

      let result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.Caus, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "わせ"}, nowSu: false});

      result = getPassCausForms(verbInfo, PassCausForms.Caus, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "わ"}, nowSu: true});
    });
    it("conjugates する correctly", () => {
      const verbInfo: ProcessedVerbInfo = suruVerbInfo;

      let result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.Caus, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "せ", newKanaRawStem: "さ"}, nowSu: false});

      result = getPassCausForms(verbInfo, PassCausForms.Caus, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "", newKanaRawStem: "さ"}, nowSu: true});
    });
    it("conjugates 来る correctly", () => {
      const verbInfo: ProcessedVerbInfo = kuruVerbInfo;

      let result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.Caus, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
      expect(result).toEqual({result: {suffix: "させ", newKanaRawStem: "こ"}, nowSu: false});

      result = getPassCausForms(verbInfo, PassCausForms.Caus, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
      expect(result).toEqual({result: {suffix: "さ", newKanaRawStem: "こ"}, nowSu: true});
    });
  });

  describe("Casuative-passive form", () => {
    it("conjugates Ichidan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = taberuVerbInfo;

      let result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.CausPass, false);
      expect(spy_getStems).not.toHaveBeenCalled();
      expect(result).toEqual({result: {suffix: "させられ"}, nowSu: false});

      result = getPassCausForms(verbInfo, PassCausForms.CausPass, true);
      expect(spy_getStems).not.toHaveBeenCalled();
      expect(result).toEqual({result: {suffix: "させられ"}, nowSu: false});
    });
    it("conjugates Godan verbs correctly", () => {
      const verbInfo: ProcessedVerbInfo = auVerbInfo;

      let result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.CausPass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "わせられ"}, nowSu: false});

      result = getPassCausForms(verbInfo, PassCausForms.CausPass, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "わされ"}, nowSu: false});

      const suVerbInfo: ProcessedVerbInfo = {rawStem: {kana: "さ", kanji: "指"}, endingChar: "す", type: VerbType.Godan, irregular: false};
      result = getPassCausForms(suVerbInfo, PassCausForms.CausPass, true);
      expect(spy_getStems).toHaveBeenCalledWith(suVerbInfo, 0);
      expect(result).toEqual({result: {suffix: "させられ"}, nowSu: false});
    });
    it("conjugates する correctly", () => {
      const verbInfo: ProcessedVerbInfo = suruVerbInfo;

      let result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.CausPass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "せられ", newKanaRawStem: "さ"}, nowSu: false});

      result = getPassCausForms(verbInfo, PassCausForms.CausPass, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 0);
      expect(result).toEqual({result: {suffix: "せられ", newKanaRawStem: "さ"}, nowSu: false});
    });
    it("conjugates 来る correctly", () => {
      const verbInfo: ProcessedVerbInfo = kuruVerbInfo;

      let result: {result: ConjugationResult, nowSu?: boolean} | Error = getPassCausForms(verbInfo, PassCausForms.CausPass, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
      expect(result).toEqual({result: {suffix: "させられ", newKanaRawStem: "こ"}, nowSu: false});

      result = getPassCausForms(verbInfo, PassCausForms.CausPass, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 3);
      expect(result).toEqual({result: {suffix: "させられ", newKanaRawStem: "こ"}, nowSu: false});
    });
  });

  describe("Get and process Aux Forms", () => {
    it("handles る ending results properly", () => {
      const verbInfo = taberuVerbInfo;
      const result: ProcessedVerbInfo | Error = getAndProcessAuxForm(verbInfo, AuxiliaryFormName.Passive, false);
      expect(result).toEqual({rawStem: {kana: "たべられ", kanji: "食べられ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false});
    })
    it("handles す ending results properly", () => {
      const verbInfo = auVerbInfo;
      const result: ProcessedVerbInfo | Error = getAndProcessAuxForm(verbInfo, AuxiliaryFormName.Causative, true);
      expect(result).toEqual({rawStem: {kana: "あわ", kanji: "会わ"}, endingChar: "す", type: VerbType.Godan, irregular: false});
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