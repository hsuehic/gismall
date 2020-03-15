// For React Native version 0.59 or later
const upstreamTransformer = require('metro-react-native-babel-transformer');

// For React Native version 0.56-0.58
// var upstreamTransformer = require("metro/src/reactNativeTransformer");

// For React Native version 0.52-0.55
// var upstreamTransformer = require("metro/src/transformer");

// For React Native version 0.47-0.51
// var upstreamTransformer = require("metro-bundler/src/transformer");

// For React Native version 0.46
// var upstreamTransformer = require("metro-bundler/build/transformer");

const sassTransformer = require('react-native-sass-transformer');
const cssTransformer = require('react-native-css-transformer');
const lessTransformer = require('react-native-less-transformer');


module.exports.transform = function({ src, filename, options }) {
  if (filename.endsWith('.scss') || filename.endsWith('.sass')) {
    return sassTransformer.transform({ src, filename, options });
  } else if (filename.endsWith('.css')) {
    return cssTransformer.transform({ src, filename, options });
  } else if (filename.endsWith('.less')) {
    return lessTransformer.transform({
      src, filename, options
    });
  }
  return upstreamTransformer.transform({ src, filename, options });
};
