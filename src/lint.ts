import { TextlintKernel } from '@textlint/kernel';
// @ts-ignore
import textlintPluginText from '@textlint/textlint-plugin-text';
// @ts-ignore
import textlintRulePresetJapanese from 'textlint-rule-preset-japanese';
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
      {
        ruleId: 'prh',
        rule: textlintRulePrh,
        options: {
          rulePaths: ['prh/kanji-open.yml', 'prh/spoken.yml', 'prh/typo.yml', 'prh/web+db.yml']
        }
      }
    ]
  });

export default lint;
