import { VerbType } from "../typedefs"

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
