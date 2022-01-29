export const runScrapboxLint = async ({ lintOptionURL }) => {
  document.head.insertAdjacentHTML(
    'beforeend',
    '<link rel="stylesheet" href="/api/code/hata6502/microtip/index.css">'
  );

  const lintOption = await getLintOption({ lintOptionURL });

  worker.addEventListener('message', (event) => {
    const data = event.data;

    switch (data.type) {
      case 'result': {
        if (scrapbox.Layout !== 'page' || getText() !== data.text) {
          return;
        }

        result = data.result;
        updatePins();

        break;
      }
      // TODO: exhaustive check
    }
  });

  new MutationObserver(updatePins).observe(document.querySelector('.page'), {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });

  new ResizeObserver(updatePins).observe(document.body);

  lintPage({ lintOption });
  scrapbox.on('lines:changed', () => lintPage({ lintOption }));
  scrapbox.on('layout:changed', () => lintPage({ lintOption }));
  scrapbox.on('project:changed', () => location.reload());
};

const pinElements = [];

const worker = new Worker('/api/code/hata6502/scrapbox-lint-worker/index.js');

let result;

const getLintOption = async ({ lintOptionURL }) => {
  if (!lintOptionURL) {
    return {};
  }

  const response = await fetch(lintOptionURL);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
};

const getText = () => scrapbox.Page.lines.map((line) => line.text).join('\n');

const lintPage = ({ lintOption }) => {
  if (scrapbox.Layout !== 'page') {
    result = undefined;
    updatePins();

    return;
  }

  worker.postMessage({ type: 'lint', lintOption, text: getText() });
};

let abortUpdatingPinsController;
let updatingPinsPromise;

const updatePins = () => {
  abortUpdatingPinsController?.abort();
  abortUpdatingPinsController = new AbortController();

  return (updatingPinsPromise = (async ({ signal }) => {
    try {
      await updatingPinsPromise;
    } catch (exception) {
      if (exception.name !== 'AbortError') {
        throw exception;
      }
    } finally {
      const messages = result?.messages ?? [];
      let messageIndex;

      for (messageIndex = 0; messageIndex < messages.length; messageIndex++) {
        const message = messages[messageIndex];

        if (signal.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }

        const bodyRect = document.body.getBoundingClientRect();
        const lineID = scrapbox.Page.lines[message.line - 1].id;

        const charElement = document
          .querySelector(`#L${lineID}`)
          ?.querySelector(`.c-${message.column - 1}`);

        if (!charElement) {
          // Abort without exception when Scrapbox layout was changed.
          return;
        }

        const charRect = charElement.getBoundingClientRect();
        const pinElement = document.createElement('div');

        pinElement.dataset.microtipPosition = 'top';
        pinElement.style.position = 'absolute';
        pinElement.style.left = `${charRect.left - bodyRect.left}px`;
        pinElement.style.top = `${charRect.top - bodyRect.top}px`;
        pinElement.style.height = `${charRect.height}px`;
        pinElement.style.width = `${charRect.width}px`;
        pinElement.style.backgroundColor = 'rgba(241, 93, 105, 0.5)';
        pinElement.setAttribute('aria-label', message.message);
        pinElement.setAttribute('role', 'tooltip');

        // ドロワーメニューの後ろに表示させる。
        document.body.prepend(pinElement);
        pinElements[messageIndex]?.remove();
        pinElements[messageIndex] = pinElement;

        await new Promise((resolve) => setTimeout(resolve));
      }

      pinElements.splice(messageIndex).forEach((pinElement) => pinElement.remove());
    }
  })({ signal: abortUpdatingPinsController.signal }));
};
