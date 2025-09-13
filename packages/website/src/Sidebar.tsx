import React, { useCallback } from "react";
import styled from "styled-components";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ForumIcon from "@material-ui/icons/Forum";
import GetAppIcon from "@material-ui/icons/GetApp";
import HelpIcon from "@material-ui/icons/Help";
import LocalFloristIcon from "@material-ui/icons/LocalFlorist";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import PaletteIcon from "@material-ui/icons/Palette";
import { initialSetting } from "./useMemo";
import type { Memo, MemosAction } from "./useMemo";

const DrawerContainer = styled.div`
  width: 250px;
`;

const MemoText = styled(ListItemText)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface SidebarProps {
  dispatchMemoId: React.Dispatch<Memo["id"]>;
  dispatchMemos: React.Dispatch<MemosAction>;
  memoId: Memo["id"];
  memos: Memo[];
  onClose?: () => void;
}

const Sidebar: React.FunctionComponent<SidebarProps> = React.memo(
  ({ dispatchMemoId, dispatchMemos, memoId, memos, onClose }) => {
    const appInstalled = !matchMedia("(display-mode: browser)").matches;

    const handleAddClick = useCallback(() => {
      const id = crypto.randomUUID();

      dispatchMemoId(id);

      dispatchMemos((prevMemos) => [
        ...prevMemos,
        {
          id,
          result: {
            filePath: "<text>",
            messages: [],
          },
          setting: initialSetting,
          text: "",
        },
      ]);

      onClose?.();
    }, [dispatchMemoId, dispatchMemos, onClose]);

    const handleMemoClick = useCallback(
      (id: Memo["id"]) => {
        dispatchMemoId(id);

        onClose?.();
      },
      [dispatchMemoId, onClose]
    );

    return (
      <DrawerContainer>
        <List>
          {memos.map(({ id, result, text }) => (
            <ListItem
              button
              key={id}
              onClick={() => handleMemoClick(id)}
              selected={id === memoId}
            >
              {result?.messages.length === 0 && (
                <CheckCircleOutlineIcon color="primary" />
              )}

              <MemoText primary={text.trim() || "(空のメモ)"} />
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
          {!appInstalled && (
            <Link
              color="inherit"
              href={
                navigator.platform.toLowerCase().includes("android") ||
                navigator.platform.toLowerCase().includes("linux")
                  ? "https://play.google.com/store/apps/details?id=com.hata6502.kohsei_san.twa"
                  : "https://help.hata6502.com/--64f09e1918f421001cd41ed3"
              }
              rel="noreferrer"
              target="_blank"
              underline="none"
            >
              <ListItem button>
                <ListItemIcon>
                  <GetAppIcon />
                </ListItemIcon>

                <ListItemText primary="アプリ版" />
              </ListItem>
            </Link>
          )}

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
            href="https://kiyac.app/privacypolicy/1DNh5JzNlQJ0IzixVc2z"
            rel="noreferrer"
            target="_blank"
            underline="none"
          >
            <ListItem button>
              <ListItemText primary="プライバシーポリシー" />
            </ListItem>
          </Link>
        </List>

        <Divider />

        <List>
          <Link
            color="inherit"
            href="https://almap.hata6502.com/"
            rel="noreferrer"
            target="_blank"
            underline="none"
          >
            <ListItem button>
              <ListItemIcon>
                <LocalFloristIcon />
              </ListItemIcon>

              <ListItemText primary="写真地図" />
            </ListItem>
          </Link>

          <Link
            color="inherit"
            href="https://premy.hata6502.com/"
            rel="noreferrer"
            target="_blank"
            underline="none"
          >
            <ListItem button>
              <ListItemIcon>
                <PaletteIcon />
              </ListItemIcon>

              <ListItemText primary="premyお絵かき" />
            </ListItem>
          </Link>
        </List>
      </DrawerContainer>
    );
  }
);

export default Sidebar;
