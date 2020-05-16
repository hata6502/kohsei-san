require.main.filename = '';

import * as Queue from 'promise-queue';
import wiki from 'wikijs';
import lint from 'common/lint';

const wikipedia = wiki({
  apiUrl: 'https://ja.wikipedia.org/w/api.php',
});

interface Content {content?: string, title?: string};

const main = async () => {
  const queue = new Queue(1);
  const scores: number[] = [];
  const titles = await wikipedia.random(5);

  titles.forEach((title) => queue.add(async () => {
    const page = await wikipedia.page(title);
    const content = (await page.content()) as unknown as Content[];
    const text = content.map(({content, title}) => `${title}\n${content}\n`).join();
    const result = await lint(text);
    const score = text.length === 0 ? 0 : result.messages.length / text.length;

    scores.push(score);
  }));

  while(queue.getQueueLength() !== 0 || queue.getPendingLength() !== 0) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const average = scores.reduce((previousValue, currentValue) => previousValue + currentValue, 0)/scores.length;
  const variance = scores.reduce((previousValue, currentValue) => previousValue + (currentValue - average)**2, 0)/scores.length;
  // スコアが低いほど偏差値を高くするため、50 から引く。
  const deviations = scores.map(score => 50 - (score-average)/Math.sqrt(variance)*10);

  console.log({
    average,
    variance,
    scores,
    deviations
  });
}

main();