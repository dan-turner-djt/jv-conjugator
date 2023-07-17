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
  Zu
}

export enum AuxiliaryFormName {
  Potential,
  Passive,
  Causative,
  CausativePassive
}

export enum AdditionalFormName {
  Continuous
}

export type FormInfo = {formName: FormName, auxFormName?: AuxiliaryFormName, additionalFormName?: AdditionalFormName, negative?: boolean, polite?: boolean, shortVer?: boolean};