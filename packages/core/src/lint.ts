import { TextlintKernel, TextlintResult } from '@textlint/kernel';
import textlintPluginText from '@textlint/textlint-plugin-text';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoDroppingI from '@textlint-ja/textlint-rule-no-dropping-i';
import textlintRuleNoFiller from '@textlint-ja/textlint-rule-no-filler';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoInsertDroppingSa from '@textlint-ja/textlint-rule-no-insert-dropping-sa';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoInsertRe from '@textlint-ja/textlint-rule-no-insert-re';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoZeroWidthSpaces from 'textlint-rule-no-zero-width-spaces';
import textlintFilterRuleURLs from 'textlint-filter-rule-urls';
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
import textlintRuleJaNoMixedPeriod from 'textlint-rule-ja-no-mixed-period';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaNoRedundantExpression from 'textlint-rule-ja-no-redundant-expression';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaNoSuccessiveWord from 'textlint-rule-ja-no-successive-word';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaNoWeakPhrase from 'textlint-rule-ja-no-weak-phrase';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaSimpleUserDictionary from 'textlint-rule-ja-simple-user-dictionary';
// @ts-expect-error 型が定義されていない。
import textlintRuleJaUnnaturalAlphabet from 'textlint-rule-ja-unnatural-alphabet';
// @ts-expect-error 型が定義されていない。
import textlintRuleMaxAppearenceCountOfWords from 'textlint-rule-max-appearence-count-of-words';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoDifficultWords from 'textlint-rule-no-difficult-words';
// @ts-expect-error 型が定義されていない。
import textlintRuleNoDoubledConjunctiveParticleGa from 'textlint-rule-no-doubled-conjunctive-particle-ga';
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
import textlintRuleSentenceLength from 'textlint-rule-sentence-length';

// https://scrapbox.io/hata6502/lintOptions
interface LintOption {
  presetJaSpacing?: boolean | Record<string, unknown>;
  presetJaTechnicalWriting?: boolean | Record<string, unknown>;
  presetJTFStyle?: boolean | Record<string, unknown>;
  generalNovelStyleJa?: boolean | Record<string, unknown>;
  jaKyoikuKanji?: boolean | Record<string, unknown>;
  jaNoMixedPeriod?: boolean | Record<string, unknown>;
  jaNoWeakPhrase?: boolean | Record<string, unknown>;
  jaSimpleUserDictionary?: Record<string, unknown>;
  maxAppearenceCountOfWords?: boolean | Record<string, unknown>;
  noFiller?: boolean | Record<string, unknown>;
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
        ruleId: 'urls',
        // @ts-expect-error 型が定義されていない。
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
            options:
              typeof lintOption.presetJaSpacing === 'object'
                ? lintOption.presetJaSpacing[key]
                : textlintRulePresetJaSpacing.rulesConfig[key],
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
              options:
                typeof lintOption.presetJaTechnicalWriting === 'object'
                  ? lintOption.presetJaTechnicalWriting[key]
                  : textlintRulePresetJaTechnicalWriting.rulesConfig[key],
            }))
        : []),
      ...(lintOption.presetJTFStyle
        ? Object.keys(textlintRulePresetJTFStyle.rules).map((key) => ({
            ruleId: key,
            rule: textlintRulePresetJTFStyle.rules[key],
            options:
              typeof lintOption.presetJTFStyle === 'object'
                ? lintOption.presetJTFStyle[key]
                : textlintRulePresetJTFStyle.rulesConfig[key],
          }))
        : []),
      ...(lintOption.generalNovelStyleJa
        ? [
            {
              ruleId: 'general-novel-style-ja',
              rule: textlintRuleGeneralNovelStyleJa,
              options:
                typeof lintOption.generalNovelStyleJa === 'object' &&
                lintOption.generalNovelStyleJa !== null
                  ? lintOption.generalNovelStyleJa
                  : undefined,
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
              options:
                typeof lintOption.jaKyoikuKanji === 'object' && lintOption.jaKyoikuKanji !== null
                  ? lintOption.jaKyoikuKanji
                  : undefined,
            },
          ]
        : []),
      ...(lintOption.jaNoMixedPeriod
        ? [
            {
              ruleId: 'ja-no-mixed-period',
              rule: textlintRuleJaNoMixedPeriod,
              options:
                typeof lintOption.jaNoMixedPeriod === 'object' &&
                lintOption.jaNoMixedPeriod !== null
                  ? lintOption.jaNoMixedPeriod
                  : undefined,
            },
          ]
        : []),
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
              options:
                typeof lintOption.jaNoWeakPhrase === 'object' && lintOption.jaNoWeakPhrase !== null
                  ? lintOption.jaNoWeakPhrase
                  : undefined,
            },
          ]
        : []),
      {
        ruleId: 'ja-simple-user-dictionary',
        rule: textlintRuleJaSimpleUserDictionary,
        options:
          typeof lintOption.jaSimpleUserDictionary === 'object' &&
          lintOption.jaSimpleUserDictionary !== null
            ? lintOption.jaSimpleUserDictionary
            : undefined,
      },
      {
        ruleId: 'ja-unnatural-alphabet',
        rule: textlintRuleJaUnnaturalAlphabet,
      },
      ...(lintOption.maxAppearenceCountOfWords
        ? [
            {
              ruleId: 'max-appearence-count-of-words',
              rule: textlintRuleMaxAppearenceCountOfWords,
              options:
                typeof lintOption.maxAppearenceCountOfWords === 'object' &&
                lintOption.maxAppearenceCountOfWords !== null
                  ? lintOption.maxAppearenceCountOfWords
                  : undefined,
            },
          ]
        : []),
      {
        ruleId: 'no-difficult-words',
        rule: textlintRuleNoDifficultWords,
      },
      {
        ruleId: 'no-doubled-conjunctive-particle-ga',
        rule: textlintRuleNoDoubledConjunctiveParticleGa,
      },
      {
        ruleId: 'no-dropping-i',
        rule: textlintRuleNoDroppingI,
      },
      ...(lintOption.noFiller
        ? [
            {
              ruleId: 'no-filler',
              rule: textlintRuleNoFiller,
              options:
                typeof lintOption.noFiller === 'object' && lintOption.noFiller !== null
                  ? lintOption.noFiller
                  : undefined,
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
        ruleId: 'no-insert-re',
        rule: textlintRuleNoInsertRe,
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
        ruleId: 'no-zero-width-spaces',
        rule: textlintRuleNoZeroWidthSpaces,
      },
      {
        ruleId: 'prefer-tari-tari',
        rule: textlintRulePreferTariTari,
      },
      {
        ruleId: 'sentence-length',
        rule: textlintRuleSentenceLength,
      },
    ],
  });

export { lint };
export type { LintOption };
