module.exports = {
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Report',
        theme: 'lightTheme',
      },
    ],
  ],
};
