/**
 * 校正偏差値用統計プログラム
 *
 * テキストのデータ集合を元に、校正偏差値を計算するための統計データを計算します。
 *
 * (例) Wikipedia の記事データを元に計算します。
 * $ wp2txt -i jawiki-latest-pages-articles1.xml-p1p106178.bz2 -o ~/wikipedia -f 0
 * $ echo -n > ~/scores.txt && ls ~/wikipedia | xargs -IXXX sh -c "node dist/main.js ~/wikipedia/XXX >> ~/scores.txt"
 */

import fs from 'fs';
import { lint } from 'common/lint';
import score from 'common/score';

(async () => {
  const text = fs.readFileSync(process.argv[2]).toString();
  const result = await lint({ lintOption: {}, text });

  console.log(score({ result, text }));
})();
