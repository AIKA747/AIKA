import { validateEmail, validatePwd } from './validate';

it(`validateEmail`, () => {
  expect(validateEmail('332@qq.com')).toBe(true);
  expect(validateEmail('332xqq.com')).toBe(false);
  expect(validateEmail('332@qq')).toBe(false);
});

it(`validatePwd`, () => {
  expect(validatePwd('12345678')).toBe(false);
  expect(validatePwd('12345678a')).toBe(false);
  expect(validatePwd('12345678aB')).toBe(true);
  expect(validatePwd('12345678Ab!')).toBe(true);
  expect(validatePwd('12345678!a')).toBe(true);
  expect(validatePwd('12345678!b')).toBe(true);
  expect(validatePwd('1234!b')).toBe(false);
});
