import { VerbType } from "../typedefs";
import { ProcessedVerbInfo } from "../Process/Process";

export const commonVerbInfo: {
  taberuVerbInfo: ProcessedVerbInfo,
  auVerbInfo: ProcessedVerbInfo,
  suruVerbInfo: ProcessedVerbInfo,
  kuruVerbInfo: ProcessedVerbInfo,
  nomuVerbInfo: ProcessedVerbInfo,
  aruVerbInfo: ProcessedVerbInfo
} = {
  taberuVerbInfo: {rawStem: {kana: "たべ", kanji: "食べ"}, endingChar: "る", type: VerbType.Ichidan, irregular: false},
  auVerbInfo: {rawStem: {kana: "あ", kanji: "会"}, endingChar: "う", type: VerbType.Godan, irregular: false},
  suruVerbInfo: {rawStem: {kana: "す", kanji: "為"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Suru},
  kuruVerbInfo: {rawStem: {kana: "く", kanji: "来"}, endingChar: "る", type: VerbType.Ichidan, irregular: VerbType.Kuru},
  nomuVerbInfo: {rawStem: {kana: "の", kanji: "飲"}, endingChar: "む", type: VerbType.Godan, irregular: false},
  aruVerbInfo: {rawStem: {kana: "あ", kanji: "有"}, endingChar: "る", type: VerbType.Godan, irregular: VerbType.Aru}
};