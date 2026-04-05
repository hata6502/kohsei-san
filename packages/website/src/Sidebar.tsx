import React from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DifferenceIcon from "@mui/icons-material/Difference";
import GetAppIcon from "@mui/icons-material/GetApp";
import HelpIcon from "@mui/icons-material/Help";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { initialSetting } from "./useMemo";
import type { Memo, MemosAction } from "./useMemo";

const DrawerContainer = styled("div")({
  width: 250,
});

const MemoText = styled(ListItemText)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export interface SidebarProps {
  dispatchMemoId: React.Dispatch<Memo["id"]>;
  dispatchMemos: React.Dispatch<MemosAction>;
  memoId: Memo["id"];
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
  const appInstalled = !matchMedia("(display-mode: browser)").matches;

  const handleAddClick = () => {
    const id = crypto.randomUUID();

    dispatchMemos((prevMemos) => [
      {
        id,
        result: {
          filePath: "<text>",
          messages: [],
        },
        setting: initialSetting,
        text: "",
      },
      ...prevMemos,
    ]);

    dispatchMemoId(id);

    onClose?.();
  };

  const handleMemoClick = (id: Memo["id"]) => {
    dispatchMemoId(id);

    onClose?.();
  };

  return (
    <DrawerContainer>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleAddClick}>
            <ListItemIcon data-testid="sidebar-component-add-memo">
              <NoteAddIcon />
            </ListItemIcon>

            <ListItemText primary="メモを追加" />
          </ListItemButton>
        </ListItem>

        {memos.map(({ id, result, text }) => (
          <ListItem disablePadding key={id}>
            <ListItemButton
              onClick={() => handleMemoClick(id)}
              selected={id === memoId}
            >
              <MemoText primary={text.trim() || "(空のメモ)"} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {!appInstalled && (
          <ListItem disablePadding>
            <ListItemButton
              component="a"
              href={
                navigator.platform.toLowerCase().includes("android") ||
                navigator.platform.toLowerCase().includes("linux")
                  ? "https://play.google.com/store/apps/details?id=com.hata6502.kohsei_san.twa"
                  : "https://help.hata6502.com/--64f09e1918f421001cd41ed3"
              }
              rel="noreferrer"
              sx={{ color: "inherit" }}
              target="_blank"
            >
              <ListItemIcon>
                <GetAppIcon />
              </ListItemIcon>

              <ListItemText primary="アプリ版" />
            </ListItemButton>
          </ListItem>
        )}

        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="https://help.hata6502.com/?q=%E6%A0%A1%E6%AD%A3%E3%81%95%E3%82%93"
            rel="noreferrer"
            sx={{ color: "inherit" }}
            target="_blank"
          >
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>

            <ListItemText primary="ヘルプ" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="https://kiyac.app/privacypolicy/1DNh5JzNlQJ0IzixVc2z"
            rel="noreferrer"
            sx={{ color: "inherit" }}
            target="_blank"
          >
            <ListItemText primary="プライバシーポリシー" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="https://mojimage.hata6502.com/"
            rel="noreferrer"
            sx={{ color: "inherit" }}
            target="_blank"
          >
            <ListItemIcon>
              <ImageSearchIcon />
            </ListItemIcon>

            <ListItemText primary="Mojimageアクセシブル画像埋め込みツール" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="https://diff.hata6502.com/?display=pdf"
            rel="noreferrer"
            sx={{ color: "inherit" }}
            target="_blank"
          >
            <ListItemIcon>
              <DifferenceIcon />
            </ListItemIcon>

            <ListItemText primary="オフラインPDF差分比較ツール" />
          </ListItemButton>
        </ListItem>
      </List>
    </DrawerContainer>
  );
};

export default Sidebar;
