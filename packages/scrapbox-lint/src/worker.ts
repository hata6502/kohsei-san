import { lint } from 'core';

self.kuromojin = {
  dicPath: 'https://storage.googleapis.com/scrapbox-lint/',
};

let abortHandlingMessageController;

self.addEventListener('message', (event) => {
  abortHandlingMessageController?.abort();
  abortHandlingMessageController = new AbortController();

  return (async ({ signal }) => {
    const data = event.data;

    switch (data.type) {
      case 'lint': {
        const { lintOption, text } = data;
        const result = await lint({ lintOption, text });

        if (signal.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }

        postMessage({
          type: 'result',
          result,
          text,
        });

        break;
      }

      // TODO: exhaustive check
    }
  })({ signal: abortHandlingMessageController.signal });
});

lint({ lintOption: {}, text: '初回校正時でもキャッシュにヒットさせるため。' });
