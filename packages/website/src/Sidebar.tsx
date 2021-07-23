import React, { useCallback, useReducer } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import BookIcon from '@material-ui/icons/Book';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HelpIcon from '@material-ui/icons/Help';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
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
    const [deleteMemo, dispatchDeleteMemo] = useReducer(
      (prevDeleteMemo: { id?: Memo['id']; memo?: Memo }, id: Memo['id'] | undefined) => ({
        id,
        memo: memos.find((memo) => memo.id === id) || prevDeleteMemo.memo,
      }),
      { id: undefined, memo: undefined }
    );

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

    const handleDeleteDialogAgree = useCallback(() => {
      dispatchDeleteMemo(undefined);
      dispatchMemos((prevMemos) => prevMemos.filter(({ id }) => id !== deleteMemo.id));
    }, [deleteMemo.id, dispatchDeleteMemo, dispatchMemos]);

    const handleDeleteDialogClose = useCallback(
      () => dispatchDeleteMemo(undefined),
      [dispatchDeleteMemo]
    );

    const handleDeleteClick = useCallback(
      (id: Memo['id']) => dispatchDeleteMemo(id),
      [dispatchDeleteMemo]
    );

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
              {result?.messages.length === 0 && <CheckIcon color="secondary" />}

              <MemoText primary={text.trim() || '(空のメモ)'} />

              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDeleteClick(id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
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
            href="https://twitter.com/search?q=%23%E6%96%87%E4%BE%8B%E3%82%B9%E3%83%88%E3%83%83%E3%82%AF"
            rel="noreferrer"
            target="_blank"
            underline="none"
          >
            <ListItem button>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>

              <ListItemText primary="文例ストック" />
            </ListItem>
          </Link>

          <Link
            color="inherit"
            href="https://scrapbox.io/kohsei-san-help/"
            rel="noopener"
            target="_blank"
            underline="none"
          >
            <ListItem button>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>

              <ListItemText primary="ブログ" />
            </ListItem>
          </Link>

          <Link
            color="inherit"
            href="https://helpfeel.com/kohsei-san/"
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

        <Dialog open={Boolean(deleteMemo.id)} onClose={handleDeleteDialogClose}>
          <DialogTitle>
            メモ「
            {(deleteMemo.memo?.text.trim() || '(空のメモ)').substring(0, 10)}
            {((deleteMemo.memo?.text.trim().length || 0) > 10 && '…') || ''}
            」を削除しますか？
          </DialogTitle>

          <DialogContent>
            <DialogContentText>削除を元に戻すことはできません。</DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary" autoFocus>
              削除しない
            </Button>

            <Button onClick={handleDeleteDialogAgree} color="primary">
              削除する
            </Button>
          </DialogActions>
        </Dialog>
      </DrawerContainer>
    );
  }
);

export default Sidebar;
