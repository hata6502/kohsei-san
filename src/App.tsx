import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const AppContainer = styled(Container)`${({ theme }) => `
  margin-top: ${theme.spacing(10)}px;
`}`;

const AppIcon = styled.img`${({ theme }) => `
  height: auto;
  margin-right: ${theme.spacing(1)}px;
  width: 48px;
`}`;

const App: React.FunctionComponent = () => (
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
          <TextField fullWidth label="本文" margin="normal" multiline variant="outlined" />
        </Container>
      </Paper>
    </AppContainer>
  </>
);

export default App;
