import React from 'react';
import styled from 'styled-components';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ModalProps } from '@material-ui/core/Modal';
import InfoIcon from '@material-ui/icons/Info';
import TwitterIcon from '@material-ui/icons/Twitter';

const AppList = styled(List)`
  width: 250px;
`;

export interface SidebarProps {
  onClose: ModalProps['onClose'];
  open: DrawerProps['open'];
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({ onClose, open }) => {
  const handleLicenseClick: React.MouseEventHandler = () =>
    window.open('https://github.com/blue-hood/kohsei-san/blob/master/README.md');

  const handleTwitterClick: React.MouseEventHandler = () =>
    window.open('https://twitter.com/hata6502');

  return (
    <Drawer onClose={onClose} open={open}>
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
  );
};

export default Sidebar;
