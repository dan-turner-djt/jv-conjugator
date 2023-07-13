export enum VerbType {
  Ichidan, Godan
}

export type VerbInfo = {verb: {kanji: string, kana: string}, type: VerbType, irregular: false | IrregularVerbs};

export const verbsList: VerbInfo[] = [
  {verb: {kanji: "食べる", kana: "たべる"}, type: VerbType.Ichidan, irregular: false},
  {verb: {kanji: "書く", kana: "かく"}, type: VerbType.Godan, irregular: false},
  {verb: {kanji: "読む", kana: "よむ"}, type: VerbType.Godan, irregular: false},
  {verb: {kanji: "いる", kana: "いる"}, type: VerbType.Ichidan, irregular: false},
  {verb: {kanji: "歩く", kana: "あるく"}, type: VerbType.Godan, irregular: false},
  {verb: {kanji: "走る", kana: "はしる"}, type: VerbType.Godan, irregular: false}
]

export const enum IrregularVerbs {
  Suru, Kuru, Aru, Iku, Kureru, Tou, Irassharu, Ossharu, Kudasaru, Gozaru, Nasaru
}

export type irregularVerbsInfo = {type: IrregularVerbs, string: string, mostly: VerbType}

export const irregularVerbs: irregularVerbsInfo[] = [
  {type: IrregularVerbs.Suru,      string: "する",        mostly: VerbType.Ichidan},
  {type: IrregularVerbs.Kuru,      string: "来る",        mostly: VerbType.Ichidan},
  {type: IrregularVerbs.Aru,       string: "ある",        mostly: VerbType.Godan},
  {type: IrregularVerbs.Iku,       string: "行く",        mostly: VerbType.Godan},
  {type: IrregularVerbs.Kureru,    string: "くれる",      mostly: VerbType.Ichidan},
  {type: IrregularVerbs.Tou,       string: "問う",        mostly: VerbType.Godan},
  {type: IrregularVerbs.Irassharu, string: "いらっしゃる", mostly: VerbType.Godan},
  {type: IrregularVerbs.Ossharu,   string: "おっしゃる",  mostly: VerbType.Godan},
  {type: IrregularVerbs.Kudasaru,  string: "下さる",      mostly: VerbType.Godan},
  {type: IrregularVerbs.Gozaru,    string: "ござる",      mostly: VerbType.Godan},
  {type: IrregularVerbs.Nasaru,    string: "なさる",      mostly: VerbType.Godan}
]

export const stems: { [index: string]: string[] } = {
  う: ["わ", "い", "え", "お"],
  く: ["か", "き", "け", "こ"],
  ぐ: ["が", "ぎ", "げ", "ご"],
  す: ["さ", "し", "せ", "そ"],
  つ: ["た", "ち", "て", "と"],
  ぬ: ["な", "に", "ね", "の"],
  ぶ: ["ば", "び", "べ", "ぼ"],
  む: ["ま", "み", "め", "も"],
  る: ["ら", "り", "れ", "ろ"]
}

export const tStems: { [index: string]: string } = {
  う: "っ", く: "い", ぐ: "い", す: "し", つ: "っ", ぬ: "ん", ぶ: "ん", む: "ん", る: "っ"
}

export const teEndings: { [index: string]: string } = {
  う: "て", く: "て", ぐ: "で", す: "て", つ: "て", ぬ: "で", ぶ: "で", む: "で", る: "て"
}

export const taEndings: { [index: string]: string } = {
  う: "た", く: "た", ぐ: "だ", す: "た", つ: "た", ぬ: "だ", ぶ: "だ", む: "だ", る: "た"
}

export const suruStems: string[] = ["さ", "し", "せ", "そ"];

export const kuruStems: string[] = ["か", "き", "け", "こ"];
