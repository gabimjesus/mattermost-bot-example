const requiredEnvs = [
  'ACCESS_TOKENS',
  'API_TOKEN',
  'API_BASE_URL',
];

for (const envName of requiredEnvs) {
  if (!process.env[envName]) {
    throw new Error(`${envName} environment variable is required`);
  }
}

module.exports = {
  apiToken: process.env.API_TOKEN,
  apiBaseUrl: process.env.API_BASE_URL,
  allowedAccessTokens: process.env.ACCESS_TOKENS.split(','),
};
