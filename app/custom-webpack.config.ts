const Dotenv = require('dotenv-webpack');
import { Configuration } from 'webpack';

module.exports = (config: Configuration, options: any) => {
  // Add Dotenv plugin
  config.plugins = [
    ...(config.plugins || []),
    new Dotenv({
      systemvars: true, // Load system environment variables too
      path: './.env', // Path to your .env file
      safe: false // Set to true if you want to verify the .env file
    })
  ];

  return config;
};
