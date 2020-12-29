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

self.kuromojin = {
  dicPath: 'dict',
};

self['sudachi-synonyms-dictionary'] = '/dict/sudachi-synonyms-dictionary.json';

lint('TEST').then((result) => console.log(result));
