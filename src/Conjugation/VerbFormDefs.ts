export enum FormName {
  Stem,
  Present,
  PresentPol,
  Negative,
  NegPol,
  Past,
  PastPol,
  NegPast,
  NegPastPol,
  Te,
  TeReq,
  NegTe,
  NegReq,
  Naide,
  Zu,
  PotentialFull,
  PotentialShort,
  NegPotentialFull,
  NegPotentialShort,
  Passive,
  NegPassive,
  Causative,
  NegCausative,
  CausPassive,
  NegCausPassive,
  Imperative,
  NegImperative,
  Nasai,
  Volitional,
  VolitionalPol,
  BaConditional,
  NegBaConditional,
  TaraConditional,
  NegTaraConditional
}

export const enum StemType {
  a, i, u, e, o, t
}

export type formInfo = {form: FormName, name: string, type: StemType, level: JLPTLevels};

enum JLPTLevels {
  N5, N4, N3, N2, N1
}

export const allVerbForms: formInfo[] = [
  {form: FormName.Stem,               name: "Stem",                        type: StemType.i, level: JLPTLevels.N5},
  {form: FormName.Present,            name: "Dictionary form",             type: StemType.u, level: JLPTLevels.N5},
  {form: FormName.PresentPol,         name: "Present/future polite",       type: StemType.i, level: JLPTLevels.N5},
  {form: FormName.Negative,           name: "Negative plain",              type: StemType.a, level: JLPTLevels.N5},
  {form: FormName.NegPol,             name: "Negative polite",             type: StemType.i, level: JLPTLevels.N5},
  {form: FormName.Past,               name: "Past plain",                  type: StemType.t, level: JLPTLevels.N5},
  {form: FormName.PastPol,            name: "Past polite",                 type: StemType.i, level: JLPTLevels.N5},
  {form: FormName.NegPast,            name: "Negative past plain",         type: StemType.a, level: JLPTLevels.N5},
  {form: FormName.NegPastPol,         name: "Negative past polite",        type: StemType.i, level: JLPTLevels.N5},
  {form: FormName.Te,                 name: "Te form",                     type: StemType.t, level: JLPTLevels.N5},
  {form: FormName.TeReq,              name: "Request",                     type: StemType.t, level: JLPTLevels.N5},
  {form: FormName.NegTe,              name: "Negative Te form",            type: StemType.a, level: JLPTLevels.N4},
  {form: FormName.NegReq,             name: "Negative request",            type: StemType.a, level: JLPTLevels.N5},
  {form: FormName.Naide,              name: "Without ~",                   type: StemType.a, level: JLPTLevels.N5},
  {form: FormName.Zu,                 name: "Without ~ formal",            type: StemType.a, level: JLPTLevels.N3},
  {form: FormName.PotentialFull,      name: "Potential",                   type: StemType.e, level: JLPTLevels.N4},
  {form: FormName.PotentialShort,     name: "Potential (short)",           type: StemType.e, level: JLPTLevels.N3},
  {form: FormName.NegPotentialFull,   name: "Negative potential",          type: StemType.e, level: JLPTLevels.N4},
  {form: FormName.NegPotentialShort,  name: "Negative potential (short)",  type: StemType.e, level: JLPTLevels.N3},
  {form: FormName.Passive,            name: "Passive",                     type: StemType.a, level: JLPTLevels.N4},
  {form: FormName.NegPassive,         name: "Negative passive",            type: StemType.a, level: JLPTLevels.N4},
  {form: FormName.Causative,          name: "Causative",                   type: StemType.a, level: JLPTLevels.N4},
  {form: FormName.NegCausative,       name: "Negative causative",          type: StemType.a, level: JLPTLevels.N4},
  {form: FormName.CausPassive,        name: "Causative passive",           type: StemType.a, level: JLPTLevels.N4},
  {form: FormName.NegCausPassive,     name: "Negative causative passive",  type: StemType.a, level: JLPTLevels.N4},
  {form: FormName.Imperative,         name: "Imperative",                  type: StemType.e, level: JLPTLevels.N4},
  {form: FormName.NegImperative,      name: "Prohibitive",                 type: StemType.u, level: JLPTLevels.N4},
  {form: FormName.Nasai,              name: "Imperative (nasai)",          type: StemType.i, level: JLPTLevels.N5},
  {form: FormName.Volitional,         name: "Volitional",                  type: StemType.o, level: JLPTLevels.N4},
  {form: FormName.VolitionalPol,      name: "Volitional polite",           type: StemType.i, level: JLPTLevels.N5},
  {form: FormName.BaConditional,      name: "Conditional (eba)",           type: StemType.e, level: JLPTLevels.N4},
  {form: FormName.NegBaConditional,   name: "Negative conditional (eba)",  type: StemType.a, level: JLPTLevels.N4},
  {form: FormName.TaraConditional,    name: "Conditional (tara)",          type: StemType.t, level: JLPTLevels.N4},
  {form: FormName.NegTaraConditional, name: "Negative conditional (tara)", type: StemType.a, level: JLPTLevels.N4},
]