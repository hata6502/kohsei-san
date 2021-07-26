import textlintRuleProofdict from '@proofdict/textlint-rule-proofdict';
import { TextlintKernel, TextlintResult } from '@textlint/kernel';
import textlintPluginText from '@textlint/textlint-plugin-text';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoDroppingI from '@textlint-ja/textlint-rule-no-dropping-i';
import textlintRuleNoFiller from '@textlint-ja/textlint-rule-no-filler';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoInsertDroppingSa from '@textlint-ja/textlint-rule-no-insert-dropping-sa';
import textlintRuleNoSynonyms from '@textlint-ja/textlint-rule-no-synonyms';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoZeroWidthSpaces from 'textlint-rule-no-zero-width-spaces';
import textlintFilterRuleJaNamedEntities from 'textlint-filter-rule-ja-named-entities';
import textlintFilterRuleURLs from 'textlint-filter-rule-urls';
// @ts-expect-error 型が定義されていない。
import textlintRuleDateWeekdayMismatch from 'textlint-rule-date-weekday-mismatch';
import textlintRuleEnSpell from 'textlint-rule-en-spell';
// @ts-expect-error 型が定義されていない。
import textlintRuleGeneralNovelStyleJa from 'textlint-rule-general-novel-style-ja';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaHiraganaDaimeishi from 'textlint-rule-ja-hiragana-daimeishi';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaHiraganaFukushi from 'textlint-rule-ja-hiragana-fukushi';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaHiraganaHojodoushi from 'textlint-rule-ja-hiragana-hojodoushi';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaHiraganaKeishikimeishi from 'textlint-rule-ja-hiragana-keishikimeishi';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaJoyoOrJinmeiyoKanji from 'textlint-rule-ja-joyo-or-jinmeiyo-kanji';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaKyoikuKanji from 'textlint-rule-ja-kyoiku-kanji';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaNoInappropriateWords from 'textlint-rule-ja-no-inappropriate-words';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaNoMixedPeriod from 'textlint-rule-ja-no-mixed-period';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaNoOrthographicVariants from 'textlint-rule-ja-no-orthographic-variants';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaNoRedundantExpression from 'textlint-rule-ja-no-redundant-expression';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaNoSuccessiveWord from 'textlint-rule-ja-no-successive-word';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaNoWeakPhrase from 'textlint-rule-ja-no-weak-phrase';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaUnnaturalAlphabet from 'textlint-rule-ja-unnatural-alphabet';
// @ts-expect-error 型が定義されていない。
import textlintRuleMaxAppearenceCountOfWords from 'textlint-rule-max-appearence-count-of-words';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoHankakuKana from 'textlint-rule-no-hankaku-kana';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoKangxiRadicals from 'textlint-rule-no-kangxi-radicals';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoMixedZenkakuAndHankakuAlphabet from 'textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet';
// @ts-expect-error 型が定義されていない。
import textlintRulePreferTariTari from 'textlint-rule-prefer-tari-tari';
// @ts-expect-error 型が定義されていない。
import textlintRulePresetJaSpacing from 'textlint-rule-preset-ja-spacing';
// @ts-expect-error 型が定義されていない。
import textlintRulePresetJaTechnicalWriting from 'textlint-rule-preset-ja-technical-writing';
// @ts-expect-error 型が定義されていない。
import textlintRulePresetJapanese from 'textlint-rule-preset-japanese';
// @ts-expect-error 型が定義されていない。
import textlintRulePresetJTFStyle from 'textlint-rule-preset-jtf-style';
// @ts-expect-error 型が定義されていない。
import textlintRuleSentenceLength from 'textlint-rule-sentence-length';

interface LintOption {
  enSpell?: boolean;
  generalNovelStyleJa?: boolean;
  jaKyoikuKanji?: boolean;
  jaNoMixedPeriod?: boolean;
  jaNoWeakPhrase?: boolean;
  maxAppearenceCountOfWords?: boolean;
  noFiller?: boolean;
  presetJaSpacing?: boolean;
  presetJaTechnicalWriting?: boolean;
  presetJTFStyle?: boolean;
}

const kernel = new TextlintKernel();

const lint = ({
  lintOption,
  text,
}: {
  lintOption: LintOption;
  text: string;
}): Promise<TextlintResult> =>
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
      ...(lintOption.presetJaSpacing
        ? Object.keys(textlintRulePresetJaSpacing.rules).map((key) => ({
            ruleId: key,
            rule: textlintRulePresetJaSpacing.rules[key],
            options: textlintRulePresetJaSpacing.rulesConfig[key],
          }))
        : []),
      ...Object.keys(textlintRulePresetJapanese.rules)
        .filter((key) => !['sentence-length'].includes(key))
        .map((key) => ({
          ruleId: key,
          rule: textlintRulePresetJapanese.rules[key],
          options: textlintRulePresetJapanese.rulesConfig[key],
        })),
      ...(lintOption.presetJaTechnicalWriting
        ? Object.keys(textlintRulePresetJaTechnicalWriting.rules)
            .filter((key) => !['sentence-length'].includes(key))
            .map((key) => ({
              ruleId: key,
              rule: textlintRulePresetJaTechnicalWriting.rules[key],
              options: textlintRulePresetJaTechnicalWriting.rulesConfig[key],
            }))
        : []),
      ...(lintOption.presetJTFStyle
        ? Object.keys(textlintRulePresetJTFStyle.rules).map((key) => ({
            ruleId: key,
            rule: textlintRulePresetJTFStyle.rules[key],
            options: textlintRulePresetJTFStyle.rulesConfig[key],
          }))
        : []),
      {
        ruleId: 'date-weekday-mismatch',
        rule: textlintRuleDateWeekdayMismatch,
      },
      ...(lintOption.enSpell
        ? [
            {
              ruleId: 'en-spell',
              rule: textlintRuleEnSpell,
            },
          ]
        : []),
      ...(lintOption.generalNovelStyleJa
        ? [
            {
              ruleId: 'general-novel-style-ja',
              rule: textlintRuleGeneralNovelStyleJa,
            },
          ]
        : []),
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
      },
      ...(lintOption.jaKyoikuKanji
        ? [
            {
              ruleId: 'ja-kyoiku-kanji',
              rule: textlintRuleJaKyoikuKanji,
            },
          ]
        : []),
      {
        ruleId: 'ja-no-inappropriate-words',
        rule: textlintRuleJaNoInappropriateWords,
      },
      ...(lintOption.jaNoMixedPeriod
        ? [
            {
              ruleId: 'ja-no-mixed-period',
              rule: textlintRuleJaNoMixedPeriod,
            },
          ]
        : []),
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
      },
      ...(lintOption.jaNoWeakPhrase
        ? [
            {
              ruleId: 'ja-no-weak-phrase',
              rule: textlintRuleJaNoWeakPhrase,
            },
          ]
        : []),
      {
        ruleId: 'ja-unnatural-alphabet',
        rule: textlintRuleJaUnnaturalAlphabet,
      },
      ...(lintOption.maxAppearenceCountOfWords
        ? [
            {
              ruleId: 'max-appearence-count-of-words',
              rule: textlintRuleMaxAppearenceCountOfWords,
            },
          ]
        : []),
      {
        ruleId: 'no-dropping-i',
        rule: textlintRuleNoDroppingI,
      },
      ...(lintOption.noFiller
        ? [
            {
              ruleId: 'no-filler',
              rule: textlintRuleNoFiller,
            },
          ]
        : []),
      {
        ruleId: 'no-hankaku-kana',
        rule: textlintRuleNoHankakuKana,
      },
      {
        ruleId: 'no-insert-dropping-sa',
        rule: textlintRuleNoInsertDroppingSa,
      },
      {
        ruleId: 'no-kangxi-radicals',
        rule: textlintRuleNoKangxiRadicals,
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
        ruleId: 'no-zero-width-spaces',
        rule: textlintRuleNoZeroWidthSpaces,
      },
      {
        ruleId: 'prefer-tari-tari',
        rule: textlintRulePreferTariTari,
      },
      {
        ruleId: 'proofdict',
        rule: textlintRuleProofdict,
        options: {
          // 10 分
          autoUpdateInterval: 600000,
          dictURL: 'https://hata6502.github.io/proof-dictionary/',
        },
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

export { lint };
export type { LintOption };
