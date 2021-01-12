import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const EmptyContainer = styled(Container)`
  ${({ theme }) => `
    margin-bottom: ${theme.spacing(2)}px;
    margin-top: ${theme.spacing(10)}px;
  `}
`;

const Empty: React.FunctionComponent = () => (
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
          <Button variant="contained" color="primary">
            メモを追加
          </Button>
        </Link>
      </Grid>
    </Grid>
  </EmptyContainer>
);

export default Empty;
