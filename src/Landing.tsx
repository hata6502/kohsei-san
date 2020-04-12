import React from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const FirstView = styled.section`
  background-image: url('images/publicdomainq-0024864bhwjsw.jpg');
  background-position: center;
  background-size: cover;
  position: relative;
  text-align: center;
`;

const FirstViewContainer = styled(Container)`
  ${({ theme }) => `
    height: ${theme.spacing(60)}px;
    padding-top: ${theme.spacing(10)}px;
  `}
  position: relative;
`;

const FirstViewWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.75);
  height: 100%;
  position: absolute;
  width: 100%;
`;

const LandingContainer = styled.div`
  ${({ theme }) => `
    margin-bottom: ${theme.spacing(2)}px;
    margin-top: ${theme.spacing(6)}px;
  `}
`;

const Landing: React.FunctionComponent = () => (
  <LandingContainer>
    <FirstView>
      <FirstViewWrapper />

      <FirstViewContainer>
        <Typography component="h1" variant="h3">
          コンテンツへの信頼度を高めよう
        </Typography>

        <Box mb={4} mt={8}>
          <Typography component="h3" variant="subtitle1">
            その場ですぐに文章を校正できるメモ帳アプリです。
          </Typography>
        </Box>

        <Button color="primary" size="large" variant="contained">
          使ってみる
        </Button>
      </FirstViewContainer>
    </FirstView>
  </LandingContainer>
);

export default Landing;
