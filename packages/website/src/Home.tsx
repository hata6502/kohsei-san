import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { createMemo } from "./useMemo";
import type { Memo, MemosAction } from "./useMemo";

const HomeContainer = styled(Container)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const Home: React.FunctionComponent<{
  chatEnabled: boolean;
  dispatchMemoId: Dispatch<Memo["id"]>;
  setChatEnabled: Dispatch<SetStateAction<boolean>>;
  setMemos: Dispatch<MemosAction>;
}> = ({ chatEnabled, dispatchMemoId, setChatEnabled, setMemos }) => {
  const handleAddMemoClick = () => {
    const memo = createMemo();
    setMemos((prevMemos) => [memo, ...prevMemos]);
    dispatchMemoId(memo.id);
  };

  return (
    <HomeContainer maxWidth="sm">
      <Stack spacing={2}>
        <Button
          color="primary"
          startIcon={<NoteAddIcon />}
          variant="outlined"
          onClick={handleAddMemoClick}
        >
          メモを追加
        </Button>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chatEnabled}
                    onChange={(_, checked) => setChatEnabled(checked)}
                  />
                }
                label="校正さんに相談"
              />

              <Typography variant="body2">
                オンにすると、AIサーバーに情報を送信・保持します。
                <br />
                ベータ版は評価目的で提供され、性能や品質について保証はなく、一切の責任を負いません。
              </Typography>

              <Typography variant="caption">
                This site is protected by reCAPTCHA and the Google{" "}
                <Link
                  href="https://policies.google.com/privacy"
                  target="_blank"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="https://policies.google.com/terms" target="_blank">
                  Terms of Service
                </Link>{" "}
                apply.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </HomeContainer>
  );
};

export default Home;
