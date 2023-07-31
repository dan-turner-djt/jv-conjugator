export enum VerbType {
  Ichidan, Godan,
  Suru, Kuru, Aru, Iku, Kureru, Tou, Irassharu, Ossharu, Kudasaru, Gozaru, Nasaru
}

export type VerbInfo = {verb: {kana?: string, kanji?: string, }, type: VerbType};

export enum FormName {
  Stem,
  Present,
  Past,
  Te,
  Imperative,
  Volitional,
  BaConditional,
  TaraConditional,
  Naide,
  Zu,
  Tai
}

export enum AuxiliaryFormName {
  Potential,
  Passive,
  Causative,
  CausativePassive,
  Tagaru
}

export enum AdditionalFormName {
  Continuous, TeAru, TeOku, TeIku, TeKuru, TeAgeru, TeKureru, TeMorau, TeShimau
}

export type FormInfo = {formName: FormName, auxFormName?: AuxiliaryFormName, additionalFormName?: AdditionalFormName, negative?: boolean, polite?: boolean, shortVer?: boolean};

export type Result = {kana?: string, kanji?: string};