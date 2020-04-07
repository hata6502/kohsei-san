import fs from 'fs';
import fukushi from './fukushi.yml';
import hojodoushi from './hojodoushi.yml';
import kanjiOpen from './kanji-open.yml';
import spoken from './spoken.yml';
import typo from './typo.yml';
import webPlusDb from './web+db.yml';

const initializeDict = () => {
  fs.writeFileSync('fukushi.yml', fukushi);
  fs.writeFileSync('hojodoushi.yml', hojodoushi);
  fs.writeFileSync('kanji-open.yml', kanjiOpen);
  fs.writeFileSync('spoken.yml', spoken);
  fs.writeFileSync('typo.yml', typo);
  fs.writeFileSync('web+db.yml', webPlusDb);
};

export default initializeDict;
