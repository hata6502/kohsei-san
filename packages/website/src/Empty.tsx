import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/GridLegacy';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const EmptyContainer = styled(Container)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const Empty: React.FunctionComponent = React.memo(() => (
  <EmptyContainer>
    <Grid container alignItems="center" direction="column" spacing={2}>
      <Grid item>
        <img alt="" src="j260_12_0.svg" style={{ width: 140 }} />
      </Grid>

      <Grid item>
        <Typography variant="h6" gutterBottom>
          文章作成をサポート
        </Typography>
      </Grid>

      <Grid item>
        <Typography variant="body1" gutterBottom>
          原稿やビジネス文書、個人のメモなどをきれいに残しましょう。
        </Typography>
      </Grid>

      <Grid item>
        <Link
          href={`?${new URLSearchParams({
            text: '',
          }).toString()}`}
          underline="none"
        >
          <Button variant="outlined" color="primary">
            メモを追加
          </Button>
        </Link>
      </Grid>
    </Grid>
  </EmptyContainer>
));

export default Empty;
