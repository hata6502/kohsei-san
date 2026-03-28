import supportedBrowsers from "./supportedBrowsers.json";
import { supportedBrowsersRegExp } from "./supportedBrowsersRegExp";

if (!supportedBrowsersRegExp.test(navigator.userAgent)) {
  alert(`校正さんを使用するには、下記のウェブブラウザからアクセスしてください。

${supportedBrowsers.browsers.map((browser) => `・${browser}`).join("\n")}

ヘルプ https://help.hata6502.com/?q=%E6%A0%A1%E6%AD%A3%E3%81%95%E3%82%93
`);
}
