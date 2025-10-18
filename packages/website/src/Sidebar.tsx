import React, { useCallback } from "react";
import styled from "styled-components";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GetAppIcon from "@mui/icons-material/GetApp";
import HelpIcon from "@mui/icons-material/Help";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PaletteIcon from "@mui/icons-material/Palette";
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
            <ListItemButton
              key={id}
              onClick={() => handleMemoClick(id)}
              selected={id === memoId}
            >
              {result?.messages.length === 0 && (
                <CheckCircleOutlineIcon color="primary" />
              )}

              <MemoText primary={text.trim() || "(空のメモ)"} />
            </ListItemButton>
          ))}

          <ListItemButton onClick={handleAddClick}>
            <ListItemIcon data-testid="sidebar-component-add-memo">
              <NoteAddIcon />
            </ListItemIcon>

            <ListItemText primary="メモを追加" />
          </ListItemButton>
        </List>

        <Divider />

        <List>
          {!appInstalled && (
            <ListItemButton
              component="a"
              href={
                navigator.platform.toLowerCase().includes("android") ||
                navigator.platform.toLowerCase().includes("linux")
                  ? "https://play.google.com/store/apps/details?id=com.hata6502.kohsei_san.twa"
                  : "https://help.hata6502.com/--64f09e1918f421001cd41ed3"
              }
              rel="noreferrer"
              target="_blank"
              sx={{ color: "inherit", textDecoration: "none" }}
            >
              <ListItemIcon>
                <GetAppIcon />
              </ListItemIcon>

              <ListItemText primary="アプリ版" />
            </ListItemButton>
          )}

          <ListItemButton
            component="a"
            href="https://helpfeel.com/hata6502/?q=%E6%96%87%E7%AB%A0%E6%A0%A1%E6%AD%A3"
            rel="noreferrer"
            target="_blank"
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>

            <ListItemText primary="ヘルプ" />
          </ListItemButton>

          <ListItemButton
            component="a"
            href="https://kiyac.app/privacypolicy/1DNh5JzNlQJ0IzixVc2z"
            rel="noreferrer"
            target="_blank"
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            <ListItemText primary="プライバシーポリシー" />
          </ListItemButton>
        </List>

        <Divider />

        <List>
          <ListItemButton
            component="a"
            href="https://almap.hata6502.com/"
            rel="noreferrer"
            target="_blank"
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            <ListItemIcon>
              <LocalFloristIcon />
            </ListItemIcon>

            <ListItemText primary="写真地図" />
          </ListItemButton>

          <ListItemButton
            component="a"
            href="https://premy.hata6502.com/"
            rel="noreferrer"
            target="_blank"
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            <ListItemIcon>
              <PaletteIcon />
            </ListItemIcon>

            <ListItemText primary="premyお絵かき" />
          </ListItemButton>
        </List>
      </DrawerContainer>
    );
  }
);

export default Sidebar;
