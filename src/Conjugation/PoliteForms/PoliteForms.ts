import { ErrorMessages } from "../../Defs/ErrorMessages";
import { FormName } from "../../Defs/VerbFormDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { getStems } from "../Stems/Stems";

export function getPoliteForm(verbInfo: ProcessedVerbInfo, formName: FormName, negative: boolean): ConjugationResult | Error {
  const stemInfo: ConjugationResult | Error = getStems(verbInfo, 1);
  if (stemInfo instanceof Error) return stemInfo;

  switch (formName) {
    case FormName.Present:
      return {...stemInfo, suffix: stemInfo.suffix + (negative? "ません" : "ます")};
    case FormName.Past:
      return {...stemInfo, suffix: stemInfo.suffix + (negative? "ませんでした" : "ました")};
    case FormName.Te:
      return {...stemInfo, suffix: stemInfo.suffix + (negative? "ませんで" : "まして")};
    case FormName.Naide:
      if (negative) return new Error(ErrorMessages.NoNegativeForm);
      return {...stemInfo, suffix: stemInfo.suffix + "ませんで"};
    case FormName.Volitional:
      if (negative) return new Error(ErrorMessages.NoNegativeForm);
      return {...stemInfo, suffix: stemInfo.suffix + "ましょう"};
    case FormName.Imperative:
      if (negative) return new Error(ErrorMessages.NoNegativeForm);
      return {...stemInfo, suffix: stemInfo.suffix + "なさい"};
    case FormName.TaraConditional:
      return {...stemInfo, suffix: stemInfo.suffix + (negative? "ませんでしたら" : "ましたら")};
    case FormName.BaConditional:
      if (negative) return new Error(ErrorMessages.NoNegativeForm);
      return {...stemInfo, suffix: stemInfo.suffix + "ますれば"};
    default:
      return new Error(ErrorMessages.NoPoliteForm);
  }
}