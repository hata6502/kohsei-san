import React from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import TwitterIcon from '@material-ui/icons/Twitter';
import { v4 as uuidv4 } from 'uuid';
import { Memo, MemosAction } from './App';

const DrawerContainer = styled.div`
  width: 250px;
`;

export interface SidebarProps {
  dispatchMemoId: React.Dispatch<string>;
  dispatchMemos: React.Dispatch<MemosAction>;
  memoId: string;
  memos: Memo[];
  onClose?: () => void;
  open: DrawerProps['open'];
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({
  dispatchMemoId,
  dispatchMemos,
  memoId,
  memos,
  onClose,
  open
}) => {
  const handleAddClick: React.MouseEventHandler = () => {
    const id = uuidv4();

    dispatchMemos(prevMemos => [
      ...prevMemos,
      {
        id,
        text: '',
        title: ''
      }
    ]);

    dispatchMemoId(id);

    if (onClose) {
      onClose();
    }
  };

  const handleLicenseClick: React.MouseEventHandler = () =>
    window.open('https://github.com/blue-hood/kohsei-san/blob/master/README.md');

  const handleDeleteClick = (id: string) => {
    dispatchMemos(prevMemos => prevMemos.filter(prevMemo => prevMemo.id !== id));
  };

  const handleMemoClick = (id: string) => {
    dispatchMemoId(id);

    if (onClose) {
      onClose();
    }
  };

  const handleTwitterClick: React.MouseEventHandler = () =>
    window.open('https://twitter.com/hata6502');

  return (
    <Drawer onClose={onClose} open={open}>
      <DrawerContainer>
        <List>
          {memos.map(({ id, title }) => (
            <ListItem button key={id} onClick={() => handleMemoClick(id)} selected={id === memoId}>
              <ListItemText primary={title || '(タイトルなし)'} />
              {memos.length >= 2 && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDeleteClick(id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}

          <ListItem button onClick={handleAddClick}>
            <ListItemIcon>
              <NoteAddIcon />
            </ListItemIcon>
            <ListItemText primary="メモを追加" />
          </ListItem>
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
