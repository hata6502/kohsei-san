require.main.filename = '';

import * as Queue from 'promise-queue';
import wiki from 'wikijs';
import lint from 'common/lint';

const wikipedia = wiki({
  apiUrl: 'https://ja.wikipedia.org/w/api.php',
});

interface Content {content?: string, title?: string};

const main = async () => {
  const titles = await wikipedia.random(10);

  const queue = new Queue(1);

  titles.forEach((title) => queue.add(async () => {
    const page = await wikipedia.page(title);
    const content = (await page.content()) as unknown as Content[];
    const text = content.map(({content, title}) => `${title}\n${content}\n`).join();

    console.log(text);
    console.log(await lint(text));
  }));
}

main();