import 'core-js';
import 'regenerator-runtime/runtime';

import lint from 'common/lint';

declare global {
  interface Window {
    kuromojin?: {
      dicPath?: string;
    };
    ['sudachi-synonyms-dictionary']?: string;
  }
}

// eslint-disable-next-line no-restricted-globals
self.kuromojin = {
  dicPath: 'dict',
};

// eslint-disable-next-line no-restricted-globals
self['sudachi-synonyms-dictionary'] = '/dict/sudachi-synonyms-dictionary.json';

onmessage = async (event: MessageEvent<string>) => {
  const result = await lint(event.data);

  postMessage(result);
};
