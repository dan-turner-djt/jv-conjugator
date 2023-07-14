export enum VerbType {
  Ichidan, Godan,
  Suru, Kuru, Aru, Iku, Kureru, Tou, Irassharu, Ossharu, Kudasaru, Gozaru, Nasaru
}

export type VerbInfo = {verb: {kana: string, kanji?: string, }, type: VerbType};

export const verbsList: VerbInfo[] = [
  {verb: {kanji: "食べる", kana: "たべる"}, type: VerbType.Ichidan},
  {verb: {kanji: "書く", kana: "かく"}, type: VerbType.Godan},
  {verb: {kanji: "読む", kana: "よむ"}, type: VerbType.Godan},
  {verb: {kanji: "いる", kana: "いる"}, type: VerbType.Ichidan},
  {verb: {kanji: "歩く", kana: "あるく"}, type: VerbType.Godan},
  {verb: {kanji: "走る", kana: "はしる"}, type: VerbType.Godan}
]

export type irregularVerbsInfo = {type: VerbType, string: string, mostly: VerbType}

export const irregularVerbs: irregularVerbsInfo[] = [
  {type: VerbType.Suru,      string: "する",        mostly: VerbType.Ichidan},
  {type: VerbType.Kuru,      string: "来る",        mostly: VerbType.Ichidan},
  {type: VerbType.Aru,       string: "ある",        mostly: VerbType.Godan},
  {type: VerbType.Iku,       string: "行く",        mostly: VerbType.Godan},
  {type: VerbType.Kureru,    string: "くれる",      mostly: VerbType.Ichidan},
  {type: VerbType.Tou,       string: "問う",        mostly: VerbType.Godan},
  {type: VerbType.Irassharu, string: "いらっしゃる", mostly: VerbType.Godan},
  {type: VerbType.Ossharu,   string: "おっしゃる",  mostly: VerbType.Godan},
  {type: VerbType.Kudasaru,  string: "下さる",      mostly: VerbType.Godan},
  {type: VerbType.Gozaru,    string: "ござる",      mostly: VerbType.Godan},
  {type: VerbType.Nasaru,    string: "なさる",      mostly: VerbType.Godan}
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
