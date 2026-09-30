import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {font} from './theme';

export const fontsLoaded = loadFont({
  family: font.family,
  url: staticFile(font.file),
  weight: '400 600',
  format: 'woff2',
});
