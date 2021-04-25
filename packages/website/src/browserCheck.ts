import supportedBrowsers from './supportedBrowsers.json';
import { supportedBrowsersRegExp } from './supportedBrowsersRegExp';

if (!supportedBrowsersRegExp.test(navigator.userAgent)) {
  alert(`校正さんを使用するには、下記のウェブブラウザからアクセスしてください。

${supportedBrowsers.browsers.map((browser) => `・${browser}`).join('\n')}

ヘルプ https://helpfeel.com/kohsei-san/
`);
}
