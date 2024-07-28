import dotenv from 'dotenv';

// Load the correct .env file based on the PROFILE
const envFile = process.env.PROFILE
  ? `.env.${process.env.PROFILE}`
  : '.env.development';
const envPath = path.resolve(__dirname, `/${envFile}`);

// Load the environment variables
dotenv.config({ path: envPath });

// Export the configuration
module.exports = {};
