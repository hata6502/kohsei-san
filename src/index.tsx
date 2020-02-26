import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

ReactDOM.render(
  <>
    <CssBaseline />

    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">校正さん</Typography>
      </Toolbar>
    </AppBar>

    <Container>
      <Paper>
        <Container>
          <TextField fullWidth label="タイトル" margin="normal" />
          <TextField fullWidth margin="normal" multiline variant="outlined" />
        </Container>
      </Paper>
    </Container>
  </>,
  document.querySelector('.app')
);
