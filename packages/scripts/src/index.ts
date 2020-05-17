// @proofdict/textlint-rule-proofdict を動作させるため。
if (require.main) {
  require.main.filename = '';
}

import * as Queue from 'promise-queue';
import wiki from 'wikijs';
import lint from 'common/lint';
import score from 'common/score';

const wikipedia = wiki({
  apiUrl: 'https://ja.wikipedia.org/w/api.php',
});

interface Content {
  content?: string;
  title?: string;
}

const main = async (): Promise<void> => {
  const queue = new Queue(1);
  const scores: number[] = [];
  const titles = await wikipedia.random(500);

  titles.forEach((title, index) =>
    queue.add(async () => {
      console.log(`Progress: ${(index / titles.length) * 100} %`);

      const page = await wikipedia.page(title);
      const content = ((await page.content()) as unknown) as Content[];
      const text = content.map(({ content, title }) => `${title}\n${content}\n`).join();
      const result = await lint(text);

      scores.push(score({ result, text }));
      // Wikipedia API の負荷を低減するため。
      await new Promise((resolve) => setTimeout(resolve, 10000));
    })
  );

  while (queue.getQueueLength() !== 0 || queue.getPendingLength() !== 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

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
