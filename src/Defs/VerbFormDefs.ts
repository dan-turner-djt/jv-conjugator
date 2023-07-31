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
  CausativePassive
}

export enum AdditionalFormName {
  Continuous, TeAru, TeOku, TeIku, TeKuru, TeAgeru, TeKureru, TeMorau, TeShimau
}

export type FormInfo = {formName: FormName, auxFormName?: AuxiliaryFormName, additionalFormName?: AdditionalFormName, negative?: boolean, polite?: boolean, shortVer?: boolean};