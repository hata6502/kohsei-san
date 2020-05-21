/**
 * 校正偏差値用統計プログラム
 *
 * テキストのデータ集合を元に、校正偏差値を計算するための統計データを計算します。
 *
 * (例) Wikipedia の記事データを元に計算します。
 * $ wp2txt -i jawiki-latest-pages-articles1.xml-p1p106178.bz2 -o ~/wikipedia -f 0
 * $ echo ~/wikipedia/* | xargs statistics
 */

// @proofdict/textlint-rule-proofdict を動作させるため。
if (require.main) {
  require.main.filename = '';
}

import * as fs from 'fs';
import { promisify } from 'util';
import lint from 'common/lint';
import score from 'common/score';

const main = async (): Promise<void> => {
  await lint('lint を予め実行しておくと、処理が早くなる。');

  const scores = await Promise.all(
    process.argv.slice(2).map(async (filename) => {
      const buffer = await promisify(fs.readFile)(filename);
      const text = buffer.toString();
      const result = await lint(text);

      console.log(`Done: ${filename}`);

      return score({ result, text });
    })
  );

  const average =
    scores.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / scores.length;
  const variance =
    scores.reduce(
      (previousValue, currentValue) => previousValue + (currentValue - average) ** 2,
      0
    ) / scores.length;

  console.log({
    n: scores.length,
    average,
    variance,
  });
};

main();
