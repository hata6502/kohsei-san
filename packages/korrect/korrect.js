import KorrectArea from './korrect-area';
import { div } from './easy-dom';


const DISABLE_KEY = 'gramm';

class Korrect {
  constructor(options) {
    this.container = null;
    this.korrectAreas = [];
    this.initialized = false;

    this.options = {
      onChangeDebounceTimeout: 300,
      onTextChange: () => {},
      onTextCorrect: () => {},
      hideSpinner: false,
    };
    Object.assign(this.options, options);
  }

  init() {
    if (this.initialized) {
      return;
    }
    this.createKorrectContainer();
    this.attachToTextAreas();
    this.initialized = true;

    return this;
  }

  createKorrectContainer() {
    // create correction container
    const body = document.querySelector('body');
    const container = div('korrect');
    body.appendChild(container);
    this.container = container;
  }

  attachToTextAreas() {
    const tas = document.querySelectorAll('textarea');
    const ediv = document.querySelectorAll('div[contenteditable]');
    [...tas, ...ediv].forEach((ta) => {
      if (ta.dataset[DISABLE_KEY] === 'false') {
        return;
      }
      const korrectArea = new KorrectArea(ta, {
        onChange: this.options.onTextChange.bind(this),
        onCorrect: this.options.onTextCorrect.bind(this),
        onChangeDebounceTimeout: this.options.onChangeDebounceTimeout,
        hideSpinner: this.options.hideSpinner,
      });
      const { mask, mirror, suggestion } = korrectArea;
      this.container.appendChild(mask);
      this.container.appendChild(mirror);
      this.container.appendChild(suggestion);
      this.korrectAreas.push(korrectArea);
    });
  }

  onTextChange(e, korrectArea) {
    this.options.onChange((textContent, correctionData) => {
      korrectArea.updateCorrections(correctionData);
    });
  }

  getKorrectArea(el) {
    return this.korrectAreas.find((ka) => ka.textArea === el);
  }
}

export default Korrect;
