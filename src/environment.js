require('dotenv/config');

const requiredEnvs = [
  'ACCESS_TOKENS',
  'API_TOKEN',
  'API_BASE_URL',
  'HELP_BASE_URL',
  'INTERNAL_PORT',
];

for (const envName of requiredEnvs) {
  if (!process.env[envName]) {
    throw new Error(`${envName} environment variable is required`);
  }
}

module.exports = {
  port: parseInt(process.env.INTERNAL_PORT || '8080', 10),
  apiToken: process.env.API_TOKEN,
  apiBaseUrl: process.env.API_BASE_URL,
  allowedAccessTokens: process.env.ACCESS_TOKENS.split(','),
  helpBaseUrl: process.env.HELP_BASE_URL,
};
