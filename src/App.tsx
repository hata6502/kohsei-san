import React, { useState } from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ModalProps } from '@material-ui/core/Modal';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu';
import TwitterIcon from '@material-ui/icons/Twitter';
import Edit from './Edit';

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

const AppList = styled(List)`
  width: 250px;
`;

const App: React.FunctionComponent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClose: ModalProps['onClose'] = () => setIsDrawerOpen(false);

  const handleLicenseClick: React.MouseEventHandler = () =>
    window.open('https://github.com/blue-hood/kohsei-san/blob/master/README.md');

  const handleMenuIconClick: React.MouseEventHandler = () => setIsDrawerOpen(true);

  const handleTwitterClick: React.MouseEventHandler = () =>
    window.open('https://twitter.com/hata6502');

  return (
    <>
      <AppBar color="inherit">
        <Toolbar>
          <IconButton onClick={handleMenuIconClick}>
            <MenuIcon />
          </IconButton>
          <AppIcon alt="" src="favicon.png" />
          <Typography variant="h6">校正さん</Typography>
        </Toolbar>
      </AppBar>

      <Drawer onClose={handleDrawerClose} open={isDrawerOpen}>
        <AppList>
          <ListItem button onClick={handleTwitterClick}>
            <ListItemIcon>
              <TwitterIcon />
            </ListItemIcon>
            <ListItemText primary="Twitter" />
          </ListItem>
          <ListItem button onClick={handleLicenseClick}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="このアプリについて" />
          </ListItem>
        </AppList>
      </Drawer>

      <AppContainer>
        <Edit />
      </AppContainer>
    </>
  );
};

export default App;
