import { TextlintKernel } from '@textlint/kernel';
// @ts-ignore
import textlintPluginText from '@textlint/textlint-plugin-text';
// @ts-ignore
import textlintRuleJoyoKanji from 'textlint-rule-joyo-kanji';
// @ts-ignore
import textlintRulePresetJapanese from 'textlint-rule-preset-japanese';
// @ts-ignore
import textlintRulePresetJaSpacing from 'textlint-rule-preset-ja-spacing';
// @ts-ignore
import textlintRulePrh from 'textlint-rule-prh';

const kernel = new TextlintKernel();

const lint = (text: string) =>
  kernel.lintText(text, {
    ext: '.txt',
    plugins: [
      {
        pluginId: 'text',
        plugin: textlintPluginText
      }
    ],
    rules: [
      ...Object.keys(textlintRulePresetJapanese.rules).map(key => ({
        ruleId: key,
        rule: textlintRulePresetJapanese.rules[key],
        options: textlintRulePresetJapanese.rulesConfig[key]
      })),
      ...Object.keys(textlintRulePresetJaSpacing.rules).map(key => ({
        ruleId: key,
        rule: textlintRulePresetJaSpacing.rules[key],
        options: textlintRulePresetJaSpacing.rulesConfig[key]
      })),
      {
        ruleId: 'joyo-kanji',
        rule: textlintRuleJoyoKanji
      },
      {
        ruleId: 'prh',
        rule: textlintRulePrh,
        options: {
          rulePaths: ['kanji-open.yml', 'spoken.yml', 'typo.yml', 'web+db.yml']
        }
      }
    ]
  });

export default lint;
