import React, { useReducer } from 'react';
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
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import TwitterIcon from '@material-ui/icons/Twitter';
import { v4 as uuidv4 } from 'uuid';
import { Memo, MemosAction } from './useMemo';

const DrawerContainer = styled.div`
  width: 250px;
`;

const MemoText = styled(ListItemText)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface SidebarProps {
  dispatchMemoId: React.Dispatch<string>;
  dispatchMemos: React.Dispatch<MemosAction>;
  memoId: string;
  memos: Memo[];
  onClose?: () => void;
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({
  dispatchMemoId,
  dispatchMemos,
  memoId,
  memos,
  onClose,
}) => {
  const [deleteMemo, dispatchDeleteMemo] = useReducer(
    (prevDeleteMemo: { id?: string; memo?: Memo }, id: string | undefined) => ({
      id,
      memo: memos.find((memo) => memo.id === id) || prevDeleteMemo.memo,
    }),
    { id: undefined, memo: undefined }
  );

  const handleAddClick: React.MouseEventHandler = () => {
    const id = uuidv4();

    dispatchMemos((prevMemos) => [
      ...prevMemos,
      {
        id,
        result: {
          filePath: '<text>',
          messages: [],
        },
        text: '',
      },
    ]);

    dispatchMemoId(id);

    if (onClose) {
      onClose();
    }
  };

  const handleDeleteDialogAgree: React.MouseEventHandler = () => {
    dispatchDeleteMemo(undefined);
    dispatchMemos((prevMemos) => prevMemos.filter(({ id }) => id !== deleteMemo.id));
  };

  const handleDeleteDialogClose = () => dispatchDeleteMemo(undefined);
  const handleDeleteClick = (id: string) => dispatchDeleteMemo(id);

  const handleMemoClick = (id: string) => {
    dispatchMemoId(id);

    if (onClose) {
      onClose();
    }
  };

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
          <ListItemIcon>
            <NoteAddIcon />
          </ListItemIcon>

          <ListItemText primary="メモを追加" />
        </ListItem>
      </List>

      <Divider />

      <List>
        <Link
          color="inherit"
          href="https://twitter.com/hata6502"
          rel="noopener"
          target="_blank"
          underline="none"
        >
          <ListItem button>
            <ListItemIcon>
              <TwitterIcon />
            </ListItemIcon>

            <ListItemText primary="Twitter" />
          </ListItem>
        </Link>

        <Link
          color="inherit"
          href="https://github.com/hata6502/kohsei-san/blob/master/README.md"
          rel="noopener"
          target="_blank"
          underline="none"
        >
          <ListItem button>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>

            <ListItemText primary="このアプリについて" />
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
            いいえ
          </Button>

          <Button onClick={handleDeleteDialogAgree} color="primary">
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </DrawerContainer>
  );
};

export default Sidebar;
