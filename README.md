# jv-conjugator
*For all your Japanese verb conjugation needs*

## About
jv-conjugator is a powerful Japanese verb conjugator library which can provide conjugations for a wide range of verb forms and form combinations including polite forms, negative forms, auxiliary verb forms, additional て-form suffixes and colloquial short versions. The library is written purely in TypeScript and fully tested using Jest. It is designed to be consumed by TypeScript projects as it takes enums as function arguments.

## Installation
`npm i jv-conjugator`

## Usage
Two callable functions are provided, `getVerbConjugation` for a single conjugation, and `getVerbConjugations` for multiple conjugations of the same `VerbInfo` object.\
The former takes one `FormInfo` object and returns one `Result` object or `Error`.
The latter takes a list of `FormInfo` objects and returns either `Error` if `VerbInfo` processing fails, or a list of `Result` objects and/or `Error` objects (if conjugation fails for a particular `FormInfo`).

Example usage:
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
