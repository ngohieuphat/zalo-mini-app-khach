// babel.config.js (Babel phiên bản 7+)
module.exports = function(api) {
    api.cache(true);
  
    const presets = [
      "@babel/preset-env",
      "@babel/preset-react"
    ];
    const plugins = [
      "@babel/plugin-transform-runtime" 
    ];
  
    return {
      presets,
      plugins
    };
  };
  