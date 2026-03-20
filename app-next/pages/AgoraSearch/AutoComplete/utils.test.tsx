import { resolveKeywords } from './utils';

it(`resolveKeywords`, () => {
  expect(resolveKeywords('iloveyou', 'love')).toEqual(['i', 'love', 'you']);
  expect(resolveKeywords('ilove', 'love')).toEqual(['i', 'love']);
  expect(resolveKeywords('ilovelove', 'love')).toEqual(['i', 'love', 'love']);
  expect(resolveKeywords('loveyou', 'love')).toEqual(['love', 'you']);
});
