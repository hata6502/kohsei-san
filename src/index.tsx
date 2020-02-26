import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import { createMuiTheme, StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const theme = createMuiTheme({
  palette: {
    primary: pink,
    secondary: purple,
  }
});

// TODO: use theme. 
const AppIcon = styled.img`${({ theme }) => `
  height: auto;
  margin-right: 8px;
  width: 48px;
`}`;

ReactDOM.render(
  <>
    <CssBaseline />

    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <AppIcon alt="" src="images/icon.png" />
            <Typography variant="h6">校正さん</Typography>
          </Toolbar>
        </AppBar>

        <Container>
          <Paper>
            <Container>
              <TextField fullWidth label="タイトル" margin="normal" />
              <TextField fullWidth label="本文" margin="normal" multiline variant="outlined" />
            </Container>
          </Paper>
        </Container>
      </ThemeProvider>
    </StylesProvider>
  </>,
  document.querySelector('.app')
);
