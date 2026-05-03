const expoConfig = require('eslint-config-expo');

module.exports = [
  {
    ignores: ['/dist/*', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...expoConfig,
  },
];
