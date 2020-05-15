import * as BrowserFS from 'browserfs';
import { TextlintKernel } from '@textlint/kernel';
// @ts-ignore
import textlintPluginText from '@textlint/textlint-plugin-text';
// @ts-ignore
import textlintRuleJaHiraganaFukushi from 'textlint-rule-ja-hiragana-fukushi';
// @ts-ignore
import textlintRuleJaHiraganaHojodoushi from 'textlint-rule-ja-hiragana-hojodoushi';
// @ts-ignore
import textlintRuleJaHiraganaKeishikimeishi from 'textlint-rule-ja-hiragana-keishikimeishi';
// @ts-ignore
import textlintRuleJaNoAbusage from 'textlint-rule-ja-no-abusage';
// @ts-ignore
import textlintRuleJaNoRedundantExpression from 'textlint-rule-ja-no-redundant-expression';
// @ts-ignore
import textlintRuleJaNoWeakPhrase from 'textlint-rule-ja-no-weak-phrase';
// @ts-ignore
import textlintRuleJaUnnaturalAlphabet from 'textlint-rule-ja-unnatural-alphabet';
// @ts-ignore
import textlintRuleJoyoKanji from 'textlint-rule-joyo-kanji';
// @ts-ignore
import textlintRuleMaxAppearenceCountOfWords from 'textlint-rule-max-appearence-count-of-words';
// @ts-ignore
import textlintRuleMaxKanjiContinuousLen from 'textlint-rule-max-kanji-continuous-len';
// @ts-ignore
import textlintRuleNoHankakuKana from 'textlint-rule-no-hankaku-kana';
// @ts-ignore
import textlintRuleNoInsertDroppingSa from '@textlint-ja/textlint-rule-no-insert-dropping-sa';
// @ts-ignore
import textlintRuleNoMixedZenkakuAndHankakuAlphabet from 'textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet';
// @ts-ignore
import textlintRulePreferTariTari from 'textlint-rule-prefer-tari-tari';
// @ts-ignore
import textlintRulePresetJapanese from 'textlint-rule-preset-japanese';
// @ts-ignore
import textlintRulePresetJaSpacing from 'textlint-rule-preset-ja-spacing';
// @ts-ignore
import textlintRuleProofdict from '@proofdict/textlint-rule-proofdict';

import initializeDict from './dict';

declare global {
  interface Window {
    kuromojin?: {
      dicPath?: string;
    };
  }
}

window.kuromojin = {
  dicPath: 'dict',
};

BrowserFS.install(window);
BrowserFS.configure(
  {
    fs: 'LocalStorage',
  },
  (exception) => {
    if (exception) {
      throw exception;
    }
  }
);

initializeDict();

const kernel = new TextlintKernel();

const lint = (text: string) =>
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
      ...Object.keys(textlintRulePresetJaSpacing.rules).map((key) => ({
        ruleId: key,
        rule: textlintRulePresetJaSpacing.rules[key],
        options: textlintRulePresetJaSpacing.rulesConfig[key],
      })),
      {
        ruleId: 'ja-hiragana-fukushi',
        rule: textlintRuleJaHiraganaFukushi,
        options: {
          rulePath: 'fukushi.yml',
        },
      },
      {
        ruleId: 'ja-hiragana-hojodoushi',
        rule: textlintRuleJaHiraganaHojodoushi,
        options: {
          rulePath: 'hojodoushi.yml',
        },
      },
      {
        ruleId: 'ja-hiragana-keishikimeishi',
        rule: textlintRuleJaHiraganaKeishikimeishi,
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
        ruleId: 'ja-no-weak-phrase',
        rule: textlintRuleJaNoWeakPhrase,
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