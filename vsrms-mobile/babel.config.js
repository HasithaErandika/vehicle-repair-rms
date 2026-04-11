module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'react-native-unistyles': './src/lib/unistyles-compat',
            '@/assets': './assets',
            '@': './src',
          },
        },
      ],
    ],
  };
};
