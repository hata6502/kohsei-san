import fs from 'fs';
import fukushi from './fukushi.yml';
import hojodoushi from './hojodoushi.yml';

const initializeDict = () => {
  fs.writeFileSync('fukushi.yml', fukushi);
  fs.writeFileSync('hojodoushi.yml', hojodoushi);
};

export default initializeDict;
