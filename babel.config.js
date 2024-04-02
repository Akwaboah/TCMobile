module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@core': './src/core',
          '@domain': './src/domain',
          '@config': './src/config',
          '@dto': './src/dto',
          '@assets': '.src/assets',
          '@data': './src/data',
          '@di': './src/di',
          '@hocs': './src/presentation/hoc',
          '@hooks': './src/presentation/hook',
          '@components': './src/presentation/component',
          '@containers': './src/presentation/container',
          '@shared-state': './src/presentation/shared-state',
          '@resources': './src/presentation/resource',
          '@storyboards': './src/presentation/storyboard',
          '@navigation': './src/presentation/navigation',
          '@mocks': './__mocks__',
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
  ],
};