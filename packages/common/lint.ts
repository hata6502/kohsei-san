/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { TextlintKernel, TextlintResult } from '@textlint/kernel';
// @ts-ignore
import * as textlintPluginText from '@textlint/textlint-plugin-text';
import textlintFilterRuleJaNamedEntities from 'textlint-filter-rule-ja-named-entities';
import textlintFilterRuleURLs from 'textlint-filter-rule-urls';
// @ts-ignore
import * as textlintRuleDateWeekdayMismatch from 'textlint-rule-date-weekday-mismatch';
// @ts-ignore
import * as textlintRuleJaHiraganaKeishikimeishi from 'textlint-rule-ja-hiragana-keishikimeishi';
// @ts-ignore
import textlintRuleJaJoyoOrJinmeiyoKanji from 'textlint-rule-ja-joyo-or-jinmeiyo-kanji';
// @ts-ignore
import textlintRuleJaNoInappropriateWords from 'textlint-rule-ja-no-inappropriate-words';
// @ts-ignore
import * as textlintRuleJaNoRedundantExpression from 'textlint-rule-ja-no-redundant-expression';
// @ts-ignore
import * as textlintRuleJaUnnaturalAlphabet from 'textlint-rule-ja-unnatural-alphabet';
// @ts-ignore
import * as textlintRuleMaxAppearenceCountOfWords from 'textlint-rule-max-appearence-count-of-words';
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
/* eslint-enable @typescript-eslint/ban-ts-ignore */

const kernel = new TextlintKernel();

const lint = (text: string): Promise<TextlintResult> =>
  kernel.lintText(text, {
    ext: '.txt',
    filterRules: [
      {
        ruleId: 'ja-named-entities',
        rule: textlintFilterRuleJaNamedEntities,
      },
      {
        ruleId: 'urls',
        rule: textlintFilterRuleURLs,
      },
    ],
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
        ruleId: 'ja-hiragana-keishikimeishi',
        rule: textlintRuleJaHiraganaKeishikimeishi,
      },
      {
        ruleId: 'ja-joyo-or-jinmeiyo-kanji',
        rule: textlintRuleJaJoyoOrJinmeiyoKanji,
      },
      {
        ruleId: 'ja-no-inappropriate-words',
        rule: textlintRuleJaNoInappropriateWords,
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
        ruleId: 'max-appearence-count-of-words',
        rule: textlintRuleMaxAppearenceCountOfWords,
      },
      {
        ruleId: 'no-hankaku-kana',
        rule: textlintRuleNoHankakuKana,
      },
      /*{
        ruleId: 'no-insert-dropping-sa',
        rule: textlintRuleNoInsertDroppingSa,
      },*/
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
    ],
  });

export default lint;
