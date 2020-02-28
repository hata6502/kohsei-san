import React, { useState } from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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

const AppContainer = styled(Container)`
  ${({ theme }) => `
  margin-top: ${theme.spacing(10)}px;
`}
`;

const AppIcon = styled.img`
  ${({ theme }) => `
  height: auto;
  margin-right: ${theme.spacing(1)}px;
  width: 48px;
`}
`;

const App: React.FunctionComponent = () => {
  const [messages, setMessages] = useState<TextlintMessage[]>([]);

  const handleContentBlur: React.FocusEventHandler<HTMLTextAreaElement> = async ({ target }) =>
    setMessages((await lint(target.value)).messages);

  return (
    <>
      <AppBar color="inherit">
        <Toolbar>
          <AppIcon alt="" src="favicon.png" />
          <Typography variant="h6">校正さん</Typography>
        </Toolbar>
      </AppBar>

      <AppContainer>
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
              {messages.map(({
 column, index, message, line 
}) => (
                <li key={index}>{`行${line}, 列${column}: ${message}`}</li>
              ))}
            </ul>
          </Container>
        </Paper>
      </AppContainer>
    </>
  );
};

export default App;
