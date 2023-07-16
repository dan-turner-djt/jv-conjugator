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

export type FormInfo = {formName: FormName, auxFormName?: AuxiliaryFormName, negative?: boolean, polite?: boolean};