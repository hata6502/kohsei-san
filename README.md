<h1 align="center">Welcome to 校正さん 👋</h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://codecov.io/gh/hata6502/kohsei-san">
    <img src="https://codecov.io/gh/hata6502/kohsei-san/branch/master/graph/badge.svg" />
  </a>
  <a href="https://twitter.com/hata6502" target="_blank">
    <img alt="Twitter: hata6502" src="https://img.shields.io/twitter/follow/hata6502.svg?style=social" />
  </a>
</p>

> その場ですぐに文章を校正できるメモ帳アプリです。オフラインで完全無料、スマートフォンアプリとしてもご利用いただけます。

### 🏠 [Homepage](https://kohsei-san.b-hood.site/lp/)

## ビジョン

- 機能拡張よりも、モバイルフレンドリーな UI を優先します。
- カスタマイズ性よりも、統一された校正ルールを追求します。
- サーバーを設けず、オフラインで完結させます。

## 校正ルール

[textlint/textlint](https://github.com/textlint/textlint) のもとで次の校正ルールを使用しています。

- [textlint-ja/textlint-rule-preset-japanese](https://github.com/textlint-ja/textlint-rule-preset-japanese)
- [azu/textlint-rule-date-weekday-mismatch](https://github.com/azu/textlint-rule-date-weekday-mismatch)
- [hata6502/textlint-rule-ja-hiragana-keishikimeishi](https://github.com/hata6502/textlint-rule-ja-hiragana-keishikimeishi)
- [hata6502/textlint-rule-ja-joyo-or-jinmeiyo-kanji](https://github.com/hata6502/textlint-rule-ja-joyo-or-jinmeiyo-kanji)
- [hata6502/textlint-rule-ja-no-inappropriate-words](https://github.com/hata6502/textlint-rule-ja-no-inappropriate-words)
- [hata6502/textlint-rule-no-dropping-i](https://github.com/hata6502/textlint-rule-no-dropping-i)
- [hata6502/textlint-rule-no-insert-dropping-sa](https://github.com/hata6502/textlint-rule-no-insert-dropping-sa)
- [KeitaMoromizato/textlint-rule-max-appearence-count-of-words](https://github.com/KeitaMoromizato/textlint-rule-max-appearence-count-of-words)
- [textlint-ja/textlint-rule-ja-no-redundant-expression](https://github.com/textlint-ja/textlint-rule-ja-no-redundant-expression)
- [textlint-ja/textlint-rule-ja-no-successive-word](https://github.com/textlint-ja/textlint-rule-ja-no-successive-word)
- [textlint-ja/textlint-rule-ja-unnatural-alphabet](https://github.com/textlint-ja/textlint-rule-ja-unnatural-alphabet)
- [textlint-ja/textlint-rule-no-hankaku-kana](https://github.com/textlint-ja/textlint-rule-no-hankaku-kana)
- [textlint-ja/textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet](https://github.com/textlint-ja/textlint-rule-no-mixed-zenkaku-and-hankaku-alphabet)
- [textlint-ja/textlint-rule-no-synonyms](https://github.com/textlint-ja/textlint-rule-no-synonyms)
- [textlint-ja/textlint-rule-prefer-tari-tari](https://github.com/textlint-ja/textlint-rule-prefer-tari-tari)

## 校正偏差値

Wikipedia の記事データをスコアリングして統計をとることで、文章の品質を表す「校正偏差値」を導入しています。
詳しくは[ソースコード](https://github.com/hata6502/kohsei-san/blob/master/packages/scripts/src/index.ts)を参照してください。

## ネガポジ判定

文章中に含まれる言葉を分析して、文章がネガティブであるか、ポジティブであるかを５段階で判定します。

- 😢 　すごくネガティブ
- 😧 　ネガティブ
- 😐 　ふつう
- 😃 　ポジティブ
- 😄 　すごくポジティブ

詳しくは[hata6502/negaposi](https://github.com/hata6502/negaposi)を参照してください。

## プライバシーポリシー

アクセス解析として[Google アナリティクス](https://marketingplatform.google.com/about/analytics/terms/jp/)を利用しています。
また、エラー収集として[Sentry](https://sentry.io/welcome/)を利用しています。
送信される情報は匿名で収集されており、個人を特定するものではありません。

## Install

```sh
yarn
```

## Build

```sh
cd packages/website
yarn build
```

## Start server

```sh
cd packages/website
yarn start
```

## Develop

```sh
cd packages/website
yarn dev
```

## Generate disclaimer

```sh
yarn generate-disclaimer
```

## Lint and format

```sh
yarn fix
```

## Run tests

```sh
cd packages/website
yarn build
yarn start & yarn wait-on http://127.0.0.1:8080
cd ../..
yarn test
```

## Author

<img alt="Tomoyuki Hata" src="https://avatars.githubusercontent.com/hata6502" width="48" /> **Tomoyuki Hata <hato6502@gmail.com>**

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/blue-hood/kohsei-san/issues).

## Show your support

Give a ⭐️ if this project helped you!

## Disclaimer

The following creations are included in this product:

- [ISOMETRIC](https://isometric.online/license/)

Please see [DISCLAIMER.md](https://github.com/blue-hood/kohsei-san/blob/master/DISCLAIMER.md) for others.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
