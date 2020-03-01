import fs from 'fs';
import kanjiOpen from './kanji-open.yml';
import spoken from './spoken.yml';
import typo from './typo.yml';
import webPlusDb from './web+db.yml';

const initializePrh = () => {
  fs.writeFileSync('kanji-open.yml', kanjiOpen);
  fs.writeFileSync('spoken.yml', spoken);
  fs.writeFileSync('typo.yml', typo);
  fs.writeFileSync('web+db.yml', webPlusDb);
};

export default initializePrh;
