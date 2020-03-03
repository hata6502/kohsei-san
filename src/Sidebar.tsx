import React from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ModalProps } from '@material-ui/core/Modal';
import InfoIcon from '@material-ui/icons/Info';
import TwitterIcon from '@material-ui/icons/Twitter';
import { Memo } from './App';

const DrawerContainer = styled.div`
  width: 250px;
`;

export interface SidebarProps {
  memos: Memo[];
  onClose: ModalProps['onClose'];
  open: DrawerProps['open'];
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({ memos, onClose, open }) => {
  const handleLicenseClick: React.MouseEventHandler = () =>
    window.open('https://github.com/blue-hood/kohsei-san/blob/master/README.md');

  const handleTwitterClick: React.MouseEventHandler = () =>
    window.open('https://twitter.com/hata6502');

  return (
    <Drawer onClose={onClose} open={open}>
      <DrawerContainer>
        <List>
          {memos.map(({ id, title }) => (
            <ListItem button key={id}>
              <ListItemText primary={title || '(タイトルなし)'} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
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
        </List>
      </DrawerContainer>
    </Drawer>
  );
};

export default Sidebar;
