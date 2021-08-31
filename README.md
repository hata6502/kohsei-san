<h1 align="center">Welcome to 校正さん 👋</h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/hata6502" target="_blank">
    <img alt="Twitter: hata6502" src="https://img.shields.io/twitter/follow/hata6502.svg?style=social" />
  </a>
</p>

> その場ですぐに文章を校正できるメモ帳アプリです。オフラインで会員登録不要、スマホアプリとしてもご利用いただけます。

### 🏠 [Homepage](https://kohsei-san.b-hood.site/lp/)

## ビジョン

- 機能拡張よりも、モバイルフレンドリーな UI を優先します。
- カスタマイズ性よりも、統一された校正ルールを追求します。
- サーバーを設けず、オフラインで完結させます。

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
- [Stack Overflow](https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url)
  - Asked by [bigbob](https://stackoverflow.com/users/460129/bigbob)
  - Answered by [Daveo](https://stackoverflow.com/users/165839/daveo)

Please see [DISCLAIMER.md](https://github.com/blue-hood/kohsei-san/blob/master/DISCLAIMER.md) for others.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
