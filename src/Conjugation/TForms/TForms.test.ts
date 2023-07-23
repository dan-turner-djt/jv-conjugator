import { ConjugationResult } from "../Conjugation";
import { VerbType } from "../../Defs/VerbDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { getTForm } from "./TForms";

import Stems = require("../Stems/Stems");

describe("TForms", () => {
  describe("Ichidan conjugation", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "たべ", kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false};

    it("get the TeForm correctly", () => {
      const result: ConjugationResult | Error = getTForm(verbInfo, true);
      expect(result).toEqual({suffix: "て"});
    });
    it("gets the TaForm correctly", () => {
      const result: ConjugationResult | Error = getTForm(verbInfo, false);
      expect(result).toEqual({suffix: "た"});
    });
  });
  describe("Godan conjugation", () => {
    const spy_getTStem = jest.spyOn(Stems, "getTStem");

    function testGodan(endingChar: string, expected: string, teForm: boolean) {
      const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "", kanji: ""}, endingChar: endingChar, type: VerbType.Godan, irregular: false};
      const result: ConjugationResult | Error = getTForm(verbInfo, teForm);
      expect(spy_getTStem).toHaveBeenCalledWith(verbInfo.endingChar);
      expect(result).toEqual({suffix: expected});
    }

    it("gets the TeForm correctly", () => {
      testGodan("う", "って", true);
      testGodan("く", "いて", true);
      testGodan("ぐ", "いで", true);
      testGodan("す", "して", true);
      testGodan("つ", "って", true);
      testGodan("ぬ", "んで", true);
      testGodan("ぶ", "んで", true);
      testGodan("む", "んで", true);
      testGodan("る", "って", true);
    });
    it("gets the TaForm correctly", () => {
      testGodan("う", "った", false);
      testGodan("く", "いた", false);
      testGodan("ぐ", "いだ", false);
      testGodan("す", "した", false);
      testGodan("つ", "った", false);
      testGodan("ぬ", "んだ", false);
      testGodan("ぶ", "んだ", false);
      testGodan("む", "んだ", false);
      testGodan("る", "った", false);
    });
  });
  describe("行く conjugation", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "い", kanji: "行"}, endingChar: "く", type: VerbType.Godan, irregular: VerbType.Iku};

    it("get the TeForm correctly", () => {
      const result: ConjugationResult | Error = getTForm(verbInfo, true);
      expect(result).toEqual({suffix: "って"});
    });
    it("gets the TaForm correctly", () => {
      const result: ConjugationResult | Error = getTForm(verbInfo, false);
      expect(result).toEqual({suffix: "った"});
    });
  });
  describe("問う conjugation", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "と", kanji: "問"}, endingChar: "う", type: VerbType.Godan, irregular: VerbType.Tou};

    it("get the TeForm correctly", () => {
      const result: ConjugationResult | Error = getTForm(verbInfo, true);
      expect(result).toEqual({suffix: "うて"});
    });
    it("gets the TaForm correctly", () => {
      const result: ConjugationResult | Error = getTForm(verbInfo, false);
      expect(result).toEqual({suffix: "うた"});
    });
  });
  describe("する conjugation", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "す", kanji: "為"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Suru};
    const spy_getStems = jest.spyOn(Stems, "getStems");

    it("get the TeForm correctly", () => {
      const result: ConjugationResult | Error = getTForm(verbInfo, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 1);
      const expected: ConjugationResult = {suffix: "て", newKanaRawStem: "し"};
      expect(result).toEqual(expected);
    });
    it("gets the TaForm correctly", () => {
      const result: ConjugationResult | Error = getTForm(verbInfo, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 1);
      const expected: ConjugationResult = {suffix: "た", newKanaRawStem: "し"};
      expect(result).toEqual(expected);
    });
  });
  describe("来る conjugation", () => {
    const verbInfo: ProcessedVerbInfo = {rawStem: {kana: "く", kanji: "来"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Kuru};
    const spy_getStems = jest.spyOn(Stems, "getStems");

    it("get the TeForm correctly", () => {
      const result: ConjugationResult | Error = getTForm(verbInfo, true);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 1);
      const expected: ConjugationResult = {suffix: "て", newKanaRawStem: "き"};
      expect(result).toEqual(expected);
    });
    it("gets the TaForm correctly", () => {
      const result: ConjugationResult | Error = getTForm(verbInfo, false);
      expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 1);
      const expected: ConjugationResult = {suffix: "た", newKanaRawStem: "き"};
      expect(result).toEqual(expected);
    });
  });
});