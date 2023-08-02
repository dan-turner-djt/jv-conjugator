# jv-conjugator
*For all your Japanese verb conjugation needs*

## About
jv-conjugator is a powerful Japanese verb conjugator library which can provide conjugations for a wide range of verb forms and form combinations including polite forms, negative forms, auxiliary verb forms, additional て-form suffixes and colloquial short versions. The library is written purely in TypeScript and fully tested using Jest. It is designed to be consumed by TypeScript projects as it takes enums as function arguments.

## Installation
`npm i jv-conjugator`

## Usage
Two callable functions are provided, `getVerbConjugation` for a single conjugation, and `getVerbConjugations` for multiple conjugations of the same `VerbInfo` object.

### Arguments
#### VerbInfo
An object of type `VerbInfo`.\
`verb`: an object with string properties `kana` and `kanji`. Either one or both may be provided, but if neither are provided an error will be returned.\
`type`: `VerbType` enum. Typically `VerbType.Ichidan` or `VerbType.Godan`, but if the verb is irregular find the corresponding verb in `VerbType` to ensure irregular conjugations are correct.
#### FormInfo
An object of type `FormInfo`.\
`formName`: `FormName` enum of primary verb conjugations. Required.\
`auxFormName`: `AuxiliaryFormName` enum of auxiliary verb conjugations. Optional.\
`additional`: `AdditionalFormName` enum of additional て-form suffix verbs. Optional.\
`polite`: Boolean which will give the polite form of the requested conjugation if it exists, and return `Error` if not. Optional, default false.\
`negative`: Boolean which will give the negative form of the requested conjugation if it exists, and return `Error` if not. Optional, default false.\
`shortVer`: Boolean which will give the colloquial short version of the requested conjugation if it exists, or ignore if not. Optional, default false.

If calling `getVerbConjugations`, provide a list[] of `FormInfo` instead.\
For more information about `FormInfo` arguments, see below.

### Return Values
`getVerbConjugation`: Returns one `Result` object or `Error` if conjugation failed.\
`getVerbConjugations`: Returns either `Error` if `VerbInfo` processing fails, or a list of `Result` objects and/or `Error` objects (if conjugation fails for a particular `FormInfo`).

The `Result` object contains string properties `kana` and `kanji` which are the corresponding conjugation results. Each property will only be defined if they were defined in the `VerbInfo` argument.

### Example usage
```
import {AdditionalFormName, AuxiliaryFormName, FormInfo, FormName, Result, VerbInfo, VerbType, getVerbConjugation, getVerbConjugations} from "jv-conjugator"

const verbInfo: VerbInfo = {verb: {kana: "たべる", kanji: "食べる"}, type: VerbType.Ichidan};

const formInfo: FormInfo = {formName: FormName.Past, auxFormName: AuxiliaryFormName.Passive, polite: true, negative: true};
const res: Result | Error = getVerbConjugation(verbInfo, formInfo);
if (res instanceof Error) return;
console.log(res.kana + ", " + res.kanji);

const formInfoList: FormInfo[] = [
    {formName: FormName.Past, auxFormName: AuxiliaryFormName.Passive, polite: true, negative: true},
    {formName: FormName.Present, additionalFormName: AdditionalFormName.TeAgeru}
];
const resList: (Result | Error)[] | Error = getVerbConjugations(verbInfo, formInfoList);
if (resList instanceof Error) return;
resList.forEach(result => {
  if(result instanceof Error) return;
  console.log(result.kana + ", " + result.kanji);
});
```
