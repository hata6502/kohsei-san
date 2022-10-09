import supportedBrowsers from './supportedBrowsers.json';
import { supportedBrowsersRegExp } from './supportedBrowsersRegExp';

if (!supportedBrowsersRegExp.test(navigator.userAgent)) {
  alert(`校正さんを使用するには、下記のウェブブラウザからアクセスしてください。

${supportedBrowsers.browsers.map((browser) => `・${browser}`).join('\n')}

ヘルプ https://helpfeel.com/hata6502/?kinds=%E6%96%87%E7%AB%A0%E6%A0%A1%E6%AD%A3
`);
}
