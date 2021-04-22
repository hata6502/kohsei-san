import { TextlintKernel, TextlintResult } from '@textlint/kernel';
import textlintPluginText from '@textlint/textlint-plugin-text';
// @ts-expect-error
import textlintRuleNoDroppingI from '@textlint-ja/textlint-rule-no-dropping-i';
// @ts-expect-error
import textlintRuleNoInsertDroppingSa from '@textlint-ja/textlint-rule-no-insert-dropping-sa';
import textlintRuleNoSynonyms from '@textlint-ja/textlint-rule-no-synonyms';
import textlintFilterRuleJaNamedEntities from 'textlint-filter-rule-ja-named-entities';
import textlintFilterRuleURLs from 'textlint-filter-rule-urls';
// @ts-expect-error
import textlintRuleDateWeekdayMismatch from 'textlint-rule-date-weekday-mismatch';
import textlintRuleEnSpell from 'textlint-rule-en-spell';
// @ts-expect-error
import textlintRuleGeneralNovelStyleJa from 'textlint-rule-general-novel-style-ja';
// @ts-expect-error
import textlintRuleJaHiraganaDaimeishi from 'textlint-rule-ja-hiragana-daimeishi';
// @ts-expect-error
import textlintRuleJaHiraganaFukushi from 'textlint-rule-ja-hiragana-fukushi';
// @ts-expect-error
import textlintRuleJaHiraganaHojodoushi from 'textlint-rule-ja-hiragana-hojodoushi';
// @ts-expect-error
import textlintRuleJaHiraganaKeishikimeishi from 'textlint-rule-ja-hiragana-keishikimeishi';
// @ts-expect-error
import textlintRuleJaJoyoOrJinmeiyoKanji from 'textlint-rule-ja-joyo-or-jinmeiyo-kanji';
// @ts-expect-error
import textlintRuleJaKyoikuKanji from 'textlint-rule-ja-kyoiku-kanji';
// @ts-expect-error
import textlintRuleJaNoInappropriateWords from 'textlint-rule-ja-no-inappropriate-words';
// @ts-expect-error
import textlintRuleJaNoMixedPeriod from 'textlint-rule-ja-no-mixed-period';
// @ts-expect-error
import textlintRuleJaNoOrthographicVariants from 'textlint-rule-ja-no-orthographic-variants';
// @ts-expect-error
import textlintRuleJaNoRedundantExpression from 'textlint-rule-ja-no-redundant-expression';
// @ts-expect-error
import textlintRuleJaNoSuccessiveWord from 'textlint-rule-ja-no-successive-word';
// @ts-expect-error
import textlintRuleJaNoWeakPhrase from 'textlint-rule-ja-no-weak-phrase';
// @ts-expect-error
import textlintRuleJaUnnaturalAlphabet from 'textlint-rule-ja-unnatural-alphabet';
// @ts-expect-error
import textlintRuleMaxAppearenceCountOfWords from 'textlint-rule-max-appearence-count-of-words';
// @ts-expect-error
import textlintRuleNoHankakuKana from 'textlint-rule-no-hankaku-kana';
// @ts-expect-error
import textlintRuleNoMixedZenkakuAndHankakuAlphabet from 'textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet';
// @ts-expect-error
import textlintRulePreferTariTari from 'textlint-rule-prefer-tari-tari';
// @ts-expect-error
import textlintRulePresetJapanese from 'textlint-rule-preset-japanese';
// @ts-expect-error
import textlintRuleSentenceLength from 'textlint-rule-sentence-length';

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
      ...Object.keys(textlintRulePresetJapanese.rules)
        .filter((key) => !['sentence-length'].includes(key))
        .map((key) => ({
          ruleId: key,
          rule: textlintRulePresetJapanese.rules[key],
          options: textlintRulePresetJapanese.rulesConfig[key],
        })),
      {
        ruleId: 'date-weekday-mismatch',
        rule: textlintRuleDateWeekdayMismatch,
      },
      { // TODO: option
        ruleId: 'en-spell',
        rule: textlintRuleEnSpell,
      }, //TODO: option
      {
        ruleId: 'general-novel-style-ja',
        rule: textlintRuleGeneralNovelStyleJa,
      },
      {
        ruleId: 'ja-hiragana-daimeishi',
        rule: textlintRuleJaHiraganaDaimeishi,
      },
      {
        ruleId: 'ja-hiragana-fukushi',
        rule: textlintRuleJaHiraganaFukushi,
      },
      {
        ruleId: 'ja-hiragana-hojodoushi',
        rule: textlintRuleJaHiraganaHojodoushi,
      },
      {
        ruleId: 'ja-hiragana-keishikimeishi',
        rule: textlintRuleJaHiraganaKeishikimeishi,
      },
      {
        ruleId: 'ja-joyo-or-jinmeiyo-kanji',
        rule: textlintRuleJaJoyoOrJinmeiyoKanji,
      },  // TODO: option
      {
        ruleId: 'ja-kyoiku-kanji',
        rule: textlintRuleJaKyoikuKanji,
      },
      {
        ruleId: 'ja-no-inappropriate-words',
        rule: textlintRuleJaNoInappropriateWords,
      },
      {
        ruleId: 'ja-no-mixed-period',
        rule: textlintRuleJaNoMixedPeriod,
      }, // TODO: option
      {
        ruleId: 'ja-no-orthographic-variants',
        rule: textlintRuleJaNoOrthographicVariants,
      },
      {
        ruleId: 'ja-no-redundant-expression',
        rule: textlintRuleJaNoRedundantExpression,
      },
      {
        ruleId: 'ja-no-successive-word',
        rule: textlintRuleJaNoSuccessiveWord,
        options: {
          allow: ['/[\\u2000-\\u2DFF\\u2E00-\\u33FF\\uF900-\\uFFFD]/'],
        },
      }, // TODO: option
      {
        ruleId: 'ja-no-weak-phrase',
        rule: textlintRuleJaNoWeakPhrase,
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
        ruleId: 'no-dropping-i',
        rule: textlintRuleNoDroppingI,
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
        ruleId: 'sentence-length',
        rule: textlintRuleSentenceLength,
        options: {
          exclusionPatterns: [
            // This line is under the CC BY-SA 4.0.
            '/https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/',
          ],
        },
      },
    ],
  });

export default lint;
