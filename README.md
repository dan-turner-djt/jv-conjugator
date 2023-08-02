# jv-conjugator
*For all your Japanese verb conjugation needs*

## About
jv-conjugator is a powerful Japanese verb conjugator library which can provide conjugations for a wide range of verb forms and form combinations including polite forms, negative forms, auxiliary verb forms, additional て-form suffixes and colloquial short versions. The library is written purely in TypeScript and fully tested using Jest. It is designed to be consumed by TypeScript projects as it takes enums as function arguments.

## Installation
`npm i jv-conjugator`

## Usage
Example usage:
```
const verbInfo: VerbInfo = {verb: {kana: "たべる", kanji: "食べる"}, type: VerbType.Ichidan};
const formInfo: FormInfo = {formName: FormName.Past, auxFormName: AuxiliaryFormName.Passive, polite: true, negative: true};
const res: Result | Error = getVerbConjugation(verbInfo, formInfo);
if (res instanceof Error) return;
console.log(res.kana + "," + res.kanji);
```
