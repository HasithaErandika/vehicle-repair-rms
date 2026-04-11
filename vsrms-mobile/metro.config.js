const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Redirect all imports of react-native-unistyles (v3 requires native Nitro/TurboModules
// and cannot run in Expo Go) to a zero-native-dependency compatibility shim.
// This is handled at the Metro resolver level which takes precedence over node_modules.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-unistyles') {
    return {
      filePath: path.resolve(__dirname, 'src/lib/unistyles-compat.ts'),
      type: 'sourceFile',
    };
  }
  // Fall through to default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
