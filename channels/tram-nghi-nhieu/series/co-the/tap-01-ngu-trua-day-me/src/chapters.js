// The five chapters of the film, in order. Each one is its own scene with its own light and its own camera.
import { build as ch1 } from './ch1.js';
import { build as ch2 } from './ch2.js';
import { build as ch3 } from './ch3.js';
import { build as ch4 } from './ch4.js';
import { build as ch5 } from './ch5.js';

export const CHAPTERS = [
  { id: 'ch1', lines: ['c1', 'c19'], build: ch1 },
  { id: 'ch2', lines: ['c20', 'c78'], build: ch2 },
  { id: 'ch3', lines: ['c79', 'c106'], build: ch3 },
  { id: 'ch4', lines: ['c107', 'c146'], build: ch4 },
  { id: 'ch5', lines: ['c147', 'c185'], build: ch5 },
];
