const path = require('path');

module.exports = {
  appUrl: ['/user-preferences/notifications'],
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  sassPrefix: '.email, .userPreferences',
  /**
   * Change to false after your app is registered in configuration files
   */
  interceptChromeConfig: false,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  _unstableHotReload: process.env.HOT === 'true',
  moduleFederation: {
    exclude: ['react-router-dom'],
    shared: [{ 'react-router-dom': { singleton: true, version: '*' } }],
  },
};
