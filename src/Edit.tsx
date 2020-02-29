import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { TextlintKernel, TextlintMessage } from '@textlint/kernel';
// @ts-ignore
import textlintPluginText from '@textlint/textlint-plugin-text';
// @ts-ignore
import textlintRulePresetJapanese from 'textlint-rule-preset-japanese';

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
    rules: Object.keys(textlintRulePresetJapanese.rules).map(key => ({
      ruleId: key,
      rule: textlintRulePresetJapanese.rules[key],
      options: textlintRulePresetJapanese.rulesConfig[key]
    }))
  });

const Edit: React.FunctionComponent = () => {
  const [messages, setMessages] = useState<TextlintMessage[]>([]);

  const handleContentBlur: React.FocusEventHandler<HTMLTextAreaElement> = async ({ target }) =>
    setMessages((await lint(target.value)).messages);

  return (
    <Paper>
      <Container>
        <TextField fullWidth label="タイトル" margin="normal" />
        <TextField
          fullWidth
          label="本文"
          margin="normal"
          multiline
          onBlur={handleContentBlur}
          variant="outlined"
        />
        <ul>
          {messages.map(({ column, index, message, line }) => (
            <li key={index}>{`行${line}, 列${column}: ${message}`}</li>
          ))}
        </ul>
      </Container>
    </Paper>
  );
};

export default Edit;
