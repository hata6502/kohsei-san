import React, { useEffect, useState } from 'react';
import Alert, { AlertProps } from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import * as Sentry from '@sentry/browser';
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

export interface EditProp {
  dispatchIsLinting: React.Dispatch<boolean>;
}

const Edit: React.FunctionComponent<EditProp> = ({ dispatchIsLinting }) => {
  const [content, setContent] = useState(() => localStorage.getItem('content') || '');
  const [isLintErrorOpen, setIsLintErrorOpen] = useState(false);
  const [isSaveErrorOpen, setIsSaveErrorOpen] = useState(false);
  const [messages, setMessages] = useState<TextlintMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('content', content);
    } catch (exception) {
      setIsSaveErrorOpen(true);

      // eslint-disable-next-line no-console
      console.error(exception);
      Sentry.captureException(exception);
    }
  }, [content]);

  const handleContentBlur: React.FocusEventHandler<HTMLTextAreaElement> = ({ target }) => {
    setContent(target.value);

    dispatchIsLinting(true);
    setTimeout(async () => {
      try {
        const result = await lint(target.value);

        setMessages(result.messages);
      } catch (exception) {
        setIsLintErrorOpen(true);

        // eslint-disable-next-line no-console
        console.error(exception);
        Sentry.captureException(exception);
      } finally {
        dispatchIsLinting(false);
      }
    });
  };

  const handleLintErrorClose: AlertProps['onClose'] = () => setIsLintErrorOpen(false);

  const handleSaveErrorClose: AlertProps['onClose'] = () => setIsSaveErrorOpen(false);

  return (
    <>
      <Paper>
        <Container>
          <TextField fullWidth label="タイトル" margin="normal" />
          <TextField
            defaultValue={content}
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

      <Snackbar open={isLintErrorOpen}>
        <Alert onClose={handleLintErrorClose} severity="error">
          本文を校正できませんでした。 アプリの不具合が修正されるまで、しばらくお待ちください。
        </Alert>
      </Snackbar>

      <Snackbar open={isSaveErrorOpen}>
        <Alert onClose={handleSaveErrorClose} severity="error">
          メモをローカルに保存できませんでした。 メモのバックアップを取り、LocalStorage
          を使用できることを確認してください。
        </Alert>
      </Snackbar>
    </>
  );
};

export default Edit;
