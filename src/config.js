const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const required = (value) => {
  if(!value)
    throw new Error(`Missing required environment variable ${value}`);
  return value;
};

module.exports = {
  mongoUri: required(env.MONGO_URI || process.env.MONGO_URI)
};