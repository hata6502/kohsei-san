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

import lint from 'common/lint';

lint('TEST');
