import { Configuration, DefinePlugin } from 'webpack';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const config: Configuration = {
  plugins: [
    new DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env['API_URL']),
      'process.env.ENV_MODE': JSON.stringify(process.env['ENV_MODE'])
    })
  ]
};

export default config;
