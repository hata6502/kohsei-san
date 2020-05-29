/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { TextlintKernel, TextlintResult } from '@textlint/kernel';
// @ts-ignore
import * as textlintPluginText from '@textlint/textlint-plugin-text';
// @ts-ignore
import * as textlintRuleDateWeekdayMismatch from 'textlint-rule-date-weekday-mismatch';
import textlintRuleEnSpell from 'textlint-rule-en-spell';
// @ts-ignore
import * as textlintRuleJaNoAbusage from 'textlint-rule-ja-no-abusage';
// @ts-ignore
import * as textlintRuleJaNoRedundantExpression from 'textlint-rule-ja-no-redundant-expression';
// @ts-ignore
import * as textlintRuleJaUnnaturalAlphabet from 'textlint-rule-ja-unnatural-alphabet';
// @ts-ignore
import * as textlintRuleJoyoKanji from 'textlint-rule-joyo-kanji';
// @ts-ignore
import * as textlintRuleMaxAppearenceCountOfWords from 'textlint-rule-max-appearence-count-of-words';
// @ts-ignore
import * as textlintRuleMaxKanjiContinuousLen from 'textlint-rule-max-kanji-continuous-len';
// @ts-ignore
import * as textlintRuleNoHankakuKana from 'textlint-rule-no-hankaku-kana';
// @ts-ignore
import * as textlintRuleNoInsertDroppingSa from '@textlint-ja/textlint-rule-no-insert-dropping-sa';
// @ts-ignore
import * as textlintRuleNoMixedZenkakuAndHankakuAlphabet from 'textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet';
import textlintRuleNoSynonyms from '@textlint-ja/textlint-rule-no-synonyms';
// @ts-ignore
import * as textlintRulePreferTariTari from 'textlint-rule-prefer-tari-tari';
// @ts-ignore
import * as textlintRulePresetJapanese from 'textlint-rule-preset-japanese';
import textlintRuleProofdict from '@proofdict/textlint-rule-proofdict';
/* eslint-enable @typescript-eslint/ban-ts-ignore */

const kernel = new TextlintKernel();

const lint = (text: string): Promise<TextlintResult> =>
  kernel.lintText(text, {
    ext: '.txt',
    plugins: [
      {
        pluginId: 'text',
        plugin: textlintPluginText,
      },
    ],
    rules: [
      ...Object.keys(textlintRulePresetJapanese.rules).map((key) => ({
        ruleId: key,
        rule: textlintRulePresetJapanese.rules[key],
        options: textlintRulePresetJapanese.rulesConfig[key],
      })),
      {
        ruleId: 'date-weekday-mismatch',
        rule: textlintRuleDateWeekdayMismatch,
      },
      {
        ruleId: 'en-spell',
        rule: textlintRuleEnSpell,
      },
      {
        ruleId: 'ja-no-abusage',
        rule: textlintRuleJaNoAbusage,
      },
      {
        ruleId: 'ja-no-redundant-expression',
        rule: textlintRuleJaNoRedundantExpression,
      },
      {
        ruleId: 'ja-unnatural-alphabet',
        rule: textlintRuleJaUnnaturalAlphabet,
      },
      {
        ruleId: 'joyo-kanji',
        rule: textlintRuleJoyoKanji,
      },
      {
        ruleId: 'max-appearence-count-of-words',
        rule: textlintRuleMaxAppearenceCountOfWords,
      },
      {
        ruleId: 'max-kanji-continuous-len',
        rule: textlintRuleMaxKanjiContinuousLen,
      },
      {
        ruleId: 'no-hankaku-kana',
        rule: textlintRuleNoHankakuKana,
      },
      {
        ruleId: 'no-insert-dropping-sa',
        rule: textlintRuleNoInsertDroppingSa,
      },
      {
        ruleId: 'no-mixed-zenkaku-and-hankaku-alphabet',
        rule: textlintRuleNoMixedZenkakuAndHankakuAlphabet,
      },
      {
        ruleId: 'no-synonyms',
        rule: textlintRuleNoSynonyms,
      },
      {
        ruleId: 'prefer-tari-tari',
        rule: textlintRulePreferTariTari,
      },
      {
        ruleId: 'proofdict',
        rule: textlintRuleProofdict,
        options: {
          dictURL: 'https://blue-hood.github.io/proof-dictionary/',
        },
      },
    ],
  });

export default lint;
