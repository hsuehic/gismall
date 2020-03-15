const path = require('path');
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-classname-to-dynamic-style',
      [
        'react-native-platform-specific-extensions',
        { extensions: ['less', 'scss', 'sass'] },
      ],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@component': path.resolve(__dirname, './src/component'),
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
        },
      ],
    ],
  };
};
