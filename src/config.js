const dotenv = require('dotenv');

const env = dotenv.config().parsed;
if (!env) throw new Error('No env file found');

module.exports = {
  mongoUri: env.MONGO_URI
};