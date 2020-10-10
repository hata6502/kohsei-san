import React from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FeedbackIcon from '@material-ui/icons/Feedback';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import GitHubIcon from '@material-ui/icons/GitHub';
import InfoIcon from '@material-ui/icons/Info';
import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import TwitterIcon from '@material-ui/icons/Twitter';

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

const Image = styled.img`
  max-width: 100%;
`;

const Root = styled(Box)`
  ${({ theme }) => `
    background-color: ${theme.palette.background.paper}
  `}
`;

const SampleText = styled(Typography)`
  /* stylelint-disable property-no-vendor-prefix, value-no-vendor-prefix */
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  /* stylelint-enable property-no-vendor-prefix, value-no-vendor-prefix */
`;

const Landing: React.FunctionComponent = () => {
  const handleInternalLinkClick = ({ url }: { url: string }) => (window.location.href = url);

  return (
    <Root pt={15}>
      <Container maxWidth="md">
        <Grid container alignItems="center" justify="space-around" spacing={4}>
          <Grid item md={7} xs={12}>
            <Typography align="center" component="h1" variant="h3">
              コンテンツへの信頼度を高めよう
            </Typography>

            <Box mb={4} mt={8}>
              <Typography align="center" component="h3">
                その場ですぐに文章を校正できるメモ帳アプリです。
                オフラインで完全無料、スマートフォンアプリとしてもご利用いただけます。
              </Typography>
            </Box>

            <Typography align="center">
              <Button
                color="primary"
                onClick={() =>
                  handleInternalLinkClick({
                    url: `/?${new URLSearchParams({
                      text: `2020年4月1日(月)

冗長な表現をチェックすることができます。

誤字脱字をチェックしたり、言い回しをチェックします。

人民による人民のための人民は人民に仕えるべき人民です。

常用漢字チェック: 溌剌

入力ミスチェック: 入力mス

半角カナチェック: 半角ｶﾅ

余分な「さ」チェック: 食べたさそう

同義語のばらつきチェック: テレビジョンとテレビ

誤用チェック: うる覚え`,
                    }).toString()}`,
                  })
                }
                size="large"
                variant="contained"
              >
                使ってみる
              </Button>
            </Typography>
          </Grid>

          <Grid item md={5} xs={7}>
            <Image alt="" loading="lazy" src="images/Books_SVG.svg" />
          </Grid>
        </Grid>
      </Container>

      <section>
        <Box m={3} mb={15} mt={15}>
          <Grid container justify="space-evenly" spacing={6}>
            {[
              {
                body:
                  '誤字脱字や言い回しなど、自動で何回でも文章の品質をチェックします。校正を依頼する前のセルフチェックなどに活用できます。',
                heading: '校正業務を自動化でサポート',
                icon: <FeaturesSpellcheckIcon />,
              },
              {
                body:
                  'アプリとして登録することで、ネイティブアプリと同様のユーザー体験を提供しています。さらに、校正した文章を共有したり、音声認識で文章を入力したりできます。',
                heading: 'スマートフォンにもフレンドリー',
                icon: <FeaturesMobileFriendlyIcon />,
              },
              {
                body:
                  '文章をインターネットに送信したりせず、登録不要でご利用いただけます。校正さんはオープンソースによってメンテナンスされています。',
                heading: 'オフラインで完全無料',
                icon: <FeaturesOfflinePinIcon />,
              },
            ].map(({ body, heading, icon }) => (
              <Grid key={heading} item md={3} xs={10}>
                <Grid container alignItems="center" direction="column" spacing={5}>
                  <Grid item>{icon}</Grid>

                  <Grid item>
                    <Typography component="h2" variant="h6">
                      {heading}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Typography component="h3">{body}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
      </section>

      <section>
        <Box bgcolor="grey.100" pb={15} pt={15}>
          <Container>
            <Box mb={8}>
              <Typography align="center" component="h2" variant="h4">
                文章校正のサンプル
              </Typography>
            </Box>

            <Grid container justify="center" spacing={2}>
              {[
                {
                  text:
                    '私は今日初めてこの学習院というものの中に這入りました。もっとも以前から学習院は多分この見当だろうぐらいに考えていたには相違ありませんが、はっきりとは存じませんでした。中へ這入ったのは無論今日が初めてでございます。',
                  title: '私の個人主義',
                },
                {
                  text:
                    'ゴーシュは町の活動写真館でセロを弾く係りでした。けれどもあんまり上手でないという評判でした。上手でないどころではなく実は仲間の楽手のなかではいちばん下手でしたから、いつでも楽長にいじめられるのでした。',
                  title: 'セロ弾きのゴーシュ',
                },
                {
                  text:
                    '朕は、日本国民の総意に基いて、新日本建設の礎が、定まるに至つたことを、深くよろこび、枢密顧問の諮詢及び帝国憲法第七十三条による帝国議会の議決を経た帝国憲法の改正を裁可し、ここにこれを公布せしめる。',
                  title: '日本国憲法',
                },
                {
                  text:
                    '「相対性理論」と名づけられる理論が倚りかかっている大黒柱はいわゆる相対性理論です。私はまず相対性原理とは何であるかを明らかにしておこうと思います。私たちは二人の物理学者を考えてみましょう。この二人の物理学者はどんな物理器械をも用意しています。',
                  title: '相対性理論',
                },
                {
                  text:
                    'メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。メロスには政治がわからぬ。メロスは、村の牧人である。笛を吹き、羊と遊んで暮して来た。けれども邪悪に対しては、人一倍に敏感であった。',
                  title: '走れメロス',
                },
                {
                  text:
                    'どの天皇様の御代であったか、女御とか更衣とかいわれる後宮がおおぜいいた中に、最上の貴族出身ではないが深い御愛寵を得ている人があった。最初から自分こそはという自信と、親兄弟の勢力に恃む所があって宮中にはいった女御たちからは失敬な女としてねたまれた。その人と同等、もしくはそれより地位の低い更衣たちはまして嫉妬の焔を燃やさないわけもなかった。',
                  title: '源氏物語',
                },
                {
                  text:
                    '私はいろ不思議な国を旅行して、さまの珍しいことを見てきた者です。名前はレミュエル・ガリバーと申します。子供のときから、船に乗って外国へ行ってみたいと思っていたので、航海術や、数学や、医学などを勉強しました。',
                  title: 'ガリバー旅行記',
                },
                {
                  text:
                    '三国志は、いうまでもなく、今から約千八百年前の古典であるが、三国志の中に活躍している登場人物は、現在でも中国大陸の至る所にそのまま居るような気がする。――中国大陸へ行って、そこの雑多な庶民や要人などに接し、特に親しんでみると、三国志の中に出て来る人物の誰かしらときっと似ている。或いは、共通したものを感じる場合がしばしばある。',
                  title: '三国志',
                },
                {
                  text:
                    '最近、自由映画人連盟の人たちが映画界の戦争責任者を指摘し、その追放を主張しており、主唱者の中には私の名前もまじつているということを聞いた。それがいつどのような形で発表されたのか、くわしいことはまだ聞いていないが、それを見た人たちが私のところに来て、あれはほんとうに君の意見かときくようになつた。',
                  title: '戦争責任者の問題',
                },
              ].map(({ text, title }) => (
                <Grid key={title} item md={4} xs={10}>
                  <Card>
                    <CardContent>
                      <Typography component="h3" gutterBottom variant="h5">
                        <FormatQuoteIcon color="primary" />
                        {title}
                      </Typography>

                      <SampleText color="textSecondary" variant="body2">
                        {text}
                      </SampleText>
                    </CardContent>

                    <CardActions>
                      <Button
                        onClick={() =>
                          handleInternalLinkClick({
                            url: `/?${new URLSearchParams({ text, title }).toString()}`,
                          })
                        }
                        size="small"
                      >
                        試してみる
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </section>

      <section>
        <Box mb={15} mt={15}>
          <Container>
            <Typography align="center" component="h2" variant="h4">
              使い方
            </Typography>

            <Box m={3} mb={8} mt={8}>
              <Grid container justify="space-evenly" spacing={6}>
                {[
                  {
                    alt: '校正する文章を入力します。',
                    body: '校正する文章を入力します。他の場所を押して入力を完了します。',
                    image: 'images/Screenshot_20200414-212938.png',
                  },
                  {
                    alt: '校正が行われ、メッセージが表示されます。',
                    body: (
                      <>
                        校正が行われ、メッセージが表示されます。
                        <FeedbackIcon color="primary" />
                        を押して内容を確認します。
                      </>
                    ),
                    image: 'images/Screenshot_20200414-213005.png',
                  },
                  {
                    alt: 'メッセージをもとに文章を修正します。',
                    body: 'メッセージをもとに文章を修正します。校正を通過しました！',
                    image: 'images/Screenshot_20200414-213017.png',
                  },
                ].map(({ alt, body, image }, index) => (
                  <Grid key={image} item md={3} xs={10}>
                    <Grid container alignItems="center" direction="column" spacing={5}>
                      <Grid item>
                        <Typography color="primary" component="div" variant="h5">
                          {index + 1}.
                        </Typography>
                      </Grid>

                      <Grid item>
                        <Box boxShadow={2}>
                          <Image alt={alt} loading="lazy" src={image} />
                        </Box>
                      </Grid>

                      <Grid item>
                        <Typography component="h3">{body}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Typography align="center">
              <Button
                color="primary"
                onClick={() =>
                  handleInternalLinkClick({
                    url: `/?${new URLSearchParams({
                      text: `2020年4月1日(月)

冗長な表現をチェックすることができます。

誤字脱字をチェックしたり、言い回しをチェックします。

人民による人民のための人民は人民に仕えるべき人民です。

常用漢字チェック: 溌剌

入力ミスチェック: 入力mス

半角カナチェック: 半角ｶﾅ

余分な「さ」チェック: 食べたさそう

同義語のばらつきチェック: テレビジョンとテレビ

誤用チェック: うる覚え`,
                    }).toString()}`,
                  })
                }
                size="large"
                variant="contained"
              >
                使ってみる
              </Button>
            </Typography>
          </Container>
        </Box>
      </section>

      <section>
        <Box bgcolor="grey.100" p={2} pb={15} pt={15}>
          <Container>
            <Grid container alignItems="center" justify="space-around" spacing={4}>
              <Grid item md={6} xs={12}>
                <Paper>
                  <Box p={3}>
                    <Typography component="h2" variant="h4">
                      助けが必要ですか？
                    </Typography>

                    <Box mb={8} mt={8}>
                      <Typography component="h3">
                        校正さんは無償で自由なオープンソースによってメンテナンスされています。校正を改善するため、プロジェクトに参加しませんか？
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      {[
                        {
                          icon: <GitHubIcon />,
                          name: 'GitHub',
                          url: 'https://github.com/hata6502/kohsei-san',
                        },
                        {
                          icon: <TwitterIcon />,
                          name: 'Twitter',
                          url: 'https://twitter.com/hata6502',
                        },
                        {
                          icon: <InfoIcon />,
                          name: 'このアプリについて',
                          url: 'https://github.com/hata6502/kohsei-san/blob/master/README.md',
                        },
                      ].map(({ icon, name, url }) => (
                        <Grid key={name} item>
                          <Link
                            color="inherit"
                            href={url}
                            rel="noreferrer"
                            target="_blank"
                            underline="none"
                          >
                            <Button startIcon={icon}>{name}</Button>
                          </Link>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              <Grid item md={3} xs={12}>
                <Image
                  alt="スマートフォンでの開発"
                  loading="lazy"
                  src="images/GooglePixelVerySilver.png"
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </section>
    </Root>
  );
};

export default Landing;
