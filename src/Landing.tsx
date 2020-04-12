import React from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';

const FeaturesMobileFriendlyIcon = styled(MobileFriendlyIcon)`
  ${({ theme }) => `
    font-size: ${theme.typography.h2.fontSize}
  `}
`;

const FeaturesOfflinePinIcon = styled(OfflinePinIcon)`
  ${({ theme }) => `
    font-size: ${theme.typography.h2.fontSize}
  `}
`;

const FeaturesSpellcheckIcon = styled(SpellcheckIcon)`
  ${({ theme }) => `
    font-size: ${theme.typography.h2.fontSize}
  `}
`;

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

const Landing: React.FunctionComponent = () => (
  <Box mb={2} mt={6}>
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

    <section>
      <Box m={3} mb={30} mt={15}>
        <Grid container justify="space-evenly" spacing={6}>
          <Grid item sm={3} xs={10}>
            <Grid container alignItems="center" direction="column" spacing={5}>
              <Grid item>
                <FeaturesSpellcheckIcon />
              </Grid>

              <Grid item>
                <Typography component="h2" variant="h6">
                  校正業務を自動化でサポート
                </Typography>
              </Grid>

              <Grid item>
                <Typography component="h3" variant="body1">
                  誤字脱字や言い回しなど、自動で何度でも文章の品質をチェックします。
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item sm={3} xs={10}>
            <Grid container alignItems="center" direction="column" spacing={5}>
              <Grid item>
                <FeaturesMobileFriendlyIcon />
              </Grid>

              <Grid item>
                <Typography component="h2" variant="h6">
                  スマートフォンにもフレンドリー
                </Typography>
              </Grid>

              <Grid item>
                <Typography component="h3" variant="body1">
                  アプリとして登録することで、ネイティブアプリと同様のユーザー体験を提供しています。
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item sm={3} xs={10}>
            <Grid container alignItems="center" direction="column" spacing={5}>
              <Grid item>
                <FeaturesOfflinePinIcon />
              </Grid>

              <Grid item>
                <Typography component="h2" variant="h6">
                  オフラインで完全無料
                </Typography>
              </Grid>

              <Grid item>
                <Typography component="h3" variant="body1">
                  文章をインターネットに送信したりせず、登録不要でご利用いただけます。
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </section>
  </Box>
);

export default Landing;
