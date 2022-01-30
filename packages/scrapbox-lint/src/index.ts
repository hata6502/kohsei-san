export const runScrapboxLint = async ({ lintOptionURL }: { lintOptionURL?: string }) => {
  const popoverElement = document.createElement('div');

  popoverElement.id = 'scrapbox-lint-popover';
  popoverElement.style.display = 'none';
  popoverElement.style.position = 'absolute';
  popoverElement.style.backgroundColor = '#ffffff';
  popoverElement.style.borderRadius = '4px';
  popoverElement.style.boxShadow =
    'rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px';
  popoverElement.style.marginBottom = '16px';
  popoverElement.style.marginRight = '16px';
  popoverElement.style.maxWidth = '600px';
  popoverElement.style.padding = '16px';

  document.body.insertBefore(popoverElement, document.querySelector('#drawer-container'));

  const pinElements: HTMLDivElement[] = [];
  let abortUpdatingPinsController: AbortController;
  let result;
  let updatingPinsPromise: Promise<void>;

  const updatePins = () => {
    abortUpdatingPinsController?.abort();
    abortUpdatingPinsController = new AbortController();

    return (updatingPinsPromise = (async ({ signal }) => {
      try {
        await updatingPinsPromise;
      } catch (exception) {
        if (exception instanceof Error && exception.name !== 'AbortError') {
          throw exception;
        }
      } finally {
        popoverElement.style.display = 'none';

        const messages = result?.messages ?? [];
        let messageIndex;

        for (messageIndex = 0; messageIndex < messages.length; messageIndex++) {
          const message = messages[messageIndex];

          if (signal.aborted) {
            throw new DOMException('Aborted', 'AbortError');
          }

          const bodyRect = document.body.getBoundingClientRect();
          // @ts-expect-error
          const lineID = scrapbox.Page.lines[message.line - 1].id;

          const lineElement = document.querySelector(`#L${lineID}`);
          const charElement = lineElement?.querySelector(`.c-${message.column - 1}`);

          if (!lineElement || !charElement) {
            // Abort without exception when Scrapbox layout was changed.
            return;
          }

          const lineRect = lineElement.getBoundingClientRect();
          const charRect = charElement.getBoundingClientRect();

          const pinElement = document.createElement('div');
          const pinTop = charRect.top - bodyRect.top;
          const pinHeight = charRect.height;

          pinElement.style.position = 'absolute';
          pinElement.style.left = `${charRect.left - bodyRect.left}px`;
          pinElement.style.top = `${pinTop}px`;
          pinElement.style.height = `${pinHeight}px`;
          pinElement.style.width = `${charRect.width}px`;
          pinElement.style.backgroundColor = 'rgba(241, 93, 105, 0.5)';

          pinElement.addEventListener('click', (event) => {
            event.stopPropagation();

            popoverElement.textContent = message.message;

            popoverElement.style.display = 'block';
            popoverElement.style.left = `${lineRect.left - bodyRect.left}px`;
            popoverElement.style.top = `${pinTop + pinHeight}px`;
          });

          document.body.insertBefore(
            pinElement,
            document.querySelector('#scrapbox-lint-popover') ??
              document.querySelector('#drawer-container')
          );

          pinElements[messageIndex]?.remove();
          pinElements[messageIndex] = pinElement;

          await new Promise((resolve) => setTimeout(resolve));
        }

        pinElements.splice(messageIndex).forEach((pinElement) => pinElement.remove());
      }
    })({ signal: abortUpdatingPinsController.signal }));
  };

  // @ts-expect-error
  const getText = () => scrapbox.Page.lines.map((line) => line.text).join('\n');

  const worker = new Worker('/api/code/hata6502/scrapbox-lint-worker/index.js');

  worker.addEventListener('message', (event) => {
    const data = event.data;

    switch (data.type) {
      case 'result': {
        // @ts-expect-error
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

  const pageElement = document.querySelector('.page');

  if (!pageElement) {
    throw new Error('Page element not found.');
  }

  new MutationObserver(updatePins).observe(pageElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });

  new ResizeObserver(updatePins).observe(document.body);

  const getLintOption = async () => {
    if (!lintOptionURL) {
      return {};
    }

    const response = await fetch(lintOptionURL);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  const lintOption = await getLintOption();

  const lintPage = () => {
    // @ts-expect-error
    if (scrapbox.Layout !== 'page') {
      result = undefined;
      updatePins();

      return;
    }

    worker.postMessage({ type: 'lint', lintOption, text: getText() });
  };

  lintPage();
  // @ts-expect-error
  scrapbox.on('lines:changed', lintPage);
  // @ts-expect-error
  scrapbox.on('layout:changed', lintPage);
  // @ts-expect-error
  scrapbox.on('project:changed', () => location.reload());
};
