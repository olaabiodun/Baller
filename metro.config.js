const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable bundle splitting
config.resolver.assetExts.push('bin');

// Optimize for production
if (process.env.NODE_ENV === 'production') {
  config.minifyConfig = {
    keep_fnames: false,
    keep_classnames: false,
    mangle: {
      toplevel: false,
    },
    output: {
      comments: false,
      ascii_only: true,
    },
  };
}

module.exports = config;
