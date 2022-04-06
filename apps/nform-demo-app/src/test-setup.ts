import 'jest-preset-angular/setup-jest';

jest.mock(
  'markdown-pages',
  () => {
    return {};
  },
  { virtual: true }
);
