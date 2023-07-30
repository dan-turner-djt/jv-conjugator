import { ErrorMessages } from "../../Defs/ErrorMessages";
import { FormName } from "../../Defs/VerbFormDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { getPoliteForm } from "./PoliteForms";
import { commonVerbInfo } from "../../TestUtils/CommonVerbInfo";

import Stems = require("../Stems/Stems");

describe("Polite forms", () => {
  const verbInfo: ProcessedVerbInfo = commonVerbInfo.auVerbInfo;
  const spy_getStems = jest.spyOn(Stems, "getStems");
  const stemSuffix: string = "い";

  function testPoliteForm(formName: FormName, negative: boolean, expected: ConjugationResult | Error, shortVer?: boolean) {
    const result: ConjugationResult | Error = getPoliteForm(verbInfo, formName, negative, (shortVer === undefined? false : shortVer));
    expect(spy_getStems).toHaveBeenCalledWith(verbInfo, 1);
    expect(result).toEqual(expected);
  }

  it("conjugates positive forms correctly", () => {
    testPoliteForm(FormName.Present, false, {suffix: stemSuffix + "ます"});
    testPoliteForm(FormName.Past, false, {suffix: stemSuffix + "ました"});
    testPoliteForm(FormName.Te, false, {suffix: stemSuffix + "まして"});
    testPoliteForm(FormName.Naide, false, {suffix: stemSuffix + "ませんで"});
    testPoliteForm(FormName.Volitional, false, {suffix: stemSuffix + "ましょう"});
    testPoliteForm(FormName.Imperative, false, {suffix: stemSuffix + "なさい"});
    testPoliteForm(FormName.TaraConditional, false, {suffix: stemSuffix + "ましたら"});
    testPoliteForm(FormName.BaConditional, false, {suffix: stemSuffix + "ますれば"});
    testPoliteForm(FormName.BaConditional, false, {suffix: stemSuffix + "ませば"}, true);
    testPoliteForm(FormName.Zu, false, new Error(ErrorMessages.NoPoliteForm));
  });
  it("conjugates negative forms correctly", () => {
    testPoliteForm(FormName.Present, true, {suffix: stemSuffix + "ません"});
    testPoliteForm(FormName.Past, true, {suffix: stemSuffix + "ませんでした"});
    testPoliteForm(FormName.Te, true, {suffix: stemSuffix + "ませんで"});
    testPoliteForm(FormName.Naide, true, new Error(ErrorMessages.NoNegativeForm));
    testPoliteForm(FormName.Volitional, true, new Error(ErrorMessages.NoNegativeForm));
    testPoliteForm(FormName.Imperative, true, new Error(ErrorMessages.NoNegativeForm));
    testPoliteForm(FormName.TaraConditional, true, {suffix: stemSuffix + "ませんでしたら"});
    testPoliteForm(FormName.BaConditional, true, new Error(ErrorMessages.NoNegativeForm));
    testPoliteForm(FormName.Zu, true, new Error(ErrorMessages.NoPoliteForm));
  });
});