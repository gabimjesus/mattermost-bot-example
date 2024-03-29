require('dotenv/config');

const requiredEnvs = [
  'ACCESS_TOKENS',
  'API_BASE_URL',
  'API_TOKEN',
  'HELP_BASE_URL',
  'PORT',
];

for (const envName of requiredEnvs) {
  if (!process.env[envName]) {
    throw new Error(`${envName} environment variable is required`);
  }
}

module.exports = {
  port: parseInt(process.env.PORT || '8080', 10),
  apiToken: process.env.API_TOKEN,
  apiBaseUrl: process.env.API_BASE_URL,
  allowedAccessTokens: process.env.ACCESS_TOKENS.split(','),
  helpBaseUrl: process.env.HELP_BASE_URL,
};
