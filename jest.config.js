module.exports = {
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Report',
        theme: 'lightTheme'
      }
    ]
  ]
};
