import React, { useCallback } from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ForumIcon from '@material-ui/icons/Forum';
import HelpIcon from '@material-ui/icons/Help';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { v4 as uuidv4 } from 'uuid';
import { initialSetting } from './useMemo';
import type { Memo, MemosAction } from './useMemo';

const DrawerContainer = styled.div`
  width: 250px;
`;

const MemoText = styled(ListItemText)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface SidebarProps {
  dispatchMemoId: React.Dispatch<Memo['id']>;
  dispatchMemos: React.Dispatch<MemosAction>;
  memoId: Memo['id'];
  memos: Memo[];
  onClose?: () => void;
}

const Sidebar: React.FunctionComponent<SidebarProps> = React.memo(
  ({ dispatchMemoId, dispatchMemos, memoId, memos, onClose }) => {
    const handleAddClick = useCallback(() => {
      const id = uuidv4();

      dispatchMemoId(id);

      dispatchMemos((prevMemos) => [
        ...prevMemos,
        {
          id,
          result: {
            filePath: '<text>',
            messages: [],
          },
          setting: initialSetting,
          text: '',
        },
      ]);

      onClose?.();
    }, [dispatchMemoId, dispatchMemos, onClose]);

    const handleMemoClick = useCallback(
      (id: Memo['id']) => {
        dispatchMemoId(id);

        onClose?.();
      },
      [dispatchMemoId, onClose]
    );

    return (
      <DrawerContainer>
        <List>
          {memos.map(({ id, result, text }) => (
            <ListItem button key={id} onClick={() => handleMemoClick(id)} selected={id === memoId}>
              {result?.messages.length === 0 && <CheckCircleOutlineIcon color="primary" />}

              <MemoText primary={text.trim() || '(空のメモ)'} />
            </ListItem>
          ))}

          <ListItem button onClick={handleAddClick}>
            <ListItemIcon data-testid="sidebar-component-add-memo">
              <NoteAddIcon />
            </ListItemIcon>

            <ListItemText primary="メモを追加" />
          </ListItem>
        </List>

        <Divider />

        <List>
          <Link
            color="inherit"
            href="https://scrapbox.io/kohsei-san/"
            rel="noreferrer"
            target="_blank"
            underline="none"
          >
            <ListItem button>
              <ListItemIcon>
                <ForumIcon />
              </ListItemIcon>

              <ListItemText primary="コミュニティ" />
            </ListItem>
          </Link>

          <Link
            color="inherit"
            href="https://helpfeel.com/hata6502/?q=%E6%96%87%E7%AB%A0%E6%A0%A1%E6%AD%A3"
            rel="noreferrer"
            target="_blank"
            underline="none"
          >
            <ListItem button>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>

              <ListItemText primary="ヘルプ" />
            </ListItem>
          </Link>

          <Link
            color="inherit"
            href="https://github.com/sponsors/hata6502"
            rel="noreferrer"
            target="_blank"
            underline="none"
          >
            <ListItem button>
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>

              <ListItemText primary="投げ銭" />
            </ListItem>
          </Link>
        </List>
      </DrawerContainer>
    );
  }
);

export default Sidebar;
