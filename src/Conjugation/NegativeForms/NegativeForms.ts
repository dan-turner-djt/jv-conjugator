import { VerbType } from "../../Defs/VerbDefs";
import { ProcessedVerbInfo } from "../../Process/Process";
import { ConjugationResult } from "../Conjugation";
import { getStems } from "../Stems/Stems";

export function getNegativeForm(verbInfo: ProcessedVerbInfo, formType: NegativeForms): ConjugationResult | Error {
  const stemInfo: ConjugationResult | Error = getNegativeStem(verbInfo);
  if (stemInfo instanceof Error) return stemInfo;

  let zuStemInfo: ConjugationResult | Error;
  switch (formType) {
    case NegativeForms.Nai:
      return {...stemInfo, suffix: stemInfo.suffix + "い"};
    case NegativeForms.Nakute:
      return {...stemInfo, suffix: stemInfo.suffix + "くて"};
    case NegativeForms.Nakatta:
      return {...stemInfo, suffix: stemInfo.suffix + "かった"};
    case NegativeForms.Naide:
      return {...stemInfo, suffix: stemInfo.suffix + "いで"};
    case NegativeForms.Nakereba:
      return {...stemInfo, suffix: stemInfo.suffix + "ければ"};
    case NegativeForms.Nakattara:
      return {...stemInfo, suffix: stemInfo.suffix + "かったら"};
    case NegativeForms.Nakarou:
      return {...stemInfo, suffix: stemInfo.suffix + "かろう"};
    case NegativeForms.Zu:
      zuStemInfo = getStems(verbInfo, 0);
      if (zuStemInfo instanceof Error) return zuStemInfo;
      return {...zuStemInfo, suffix: zuStemInfo.suffix + "ず"};
    default:
      console.log("Unknown negative form");
      return stemInfo;
  }
}

export function getNegativeStem(verbInfo: ProcessedVerbInfo): ConjugationResult | Error {
  if (verbInfo.irregular !== false) {
    if (verbInfo.irregular === VerbType.Aru) {
      return {suffix: "な", newKanaRawStem: "", newKanjiRawStem: ""};
    }
    if (verbInfo.irregular === VerbType.Suru) {
      const stemInfo: ConjugationResult | Error = getStems(verbInfo, 1);
      return {...stemInfo, suffix: "な"};
    }
    if (verbInfo.irregular === VerbType.Kuru) {
      const stemInfo: ConjugationResult | Error = getStems(verbInfo, 3);
      return {...stemInfo, suffix: "な"};
    }
  }

  if (verbInfo.type === VerbType.Godan) {
    const stem: ConjugationResult | Error = getStems(verbInfo, 0);
    if (stem instanceof Error) return stem;
    return {suffix: stem.suffix + "な"};
  }
  return {suffix: "な"};
}

export enum NegativeForms {Nai, Nakute, Nakatta, Naide, Nakereba, Nakattara, Nakarou, Zu}