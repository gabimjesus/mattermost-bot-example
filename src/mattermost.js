/** https://api.mattermost.com */

const apiToken = process.env.API_TOKEN;

if (!apiToken) {
  throw new Error('API_TOKEN environment variable is required');
}

const mattermostBaseUrl = process.env.API_BASE_URL;

if (!mattermostBaseUrl) {
  throw new Error('API_BASE_URL environment variable is required');
}

module.exports = {
  findUserByUsername,
  findUserById,
  findManyUsersById,
  listPostReactions,
  getUserProfilePictureUrl,
  getUserDisplayName,
};

const axios = require('axios');

async function findUserByUsername(username) {
  const options = {
    headers: { Authorization: `Bearer ${apiToken}`},
  };

  const response = await axios.get(`${mattermostBaseUrl}/users/username/${username}`, options);
  return response.data;
}

async function findUserById(userId) {
  const options = {
    headers: { Authorization: `Bearer ${apiToken}`},
  };

  const response = await axios.get(`${mattermostBaseUrl}/users/${userId}`, options);
  return response.data;
}

async function findManyUsersById(userIds) {
  if (!userIds || !userIds.length) {
    return [];
  }

  const options = {
    headers: { Authorization: `Bearer ${apiToken}`},
  };

  const response = await axios.post(`${mattermostBaseUrl}/users/ids`, userIds, options);
  return response.data;
}

async function listPostReactions(postId) {
  const options = {
    headers: { Authorization: `Bearer ${apiToken}`},
  };

  const response = await axios.get(`${mattermostBaseUrl}/posts/${postId}/reactions`, options);
  return response.data;
}

function getUserProfilePictureUrl(userId) {
  return `${mattermostBaseUrl}/users/${userId}/image`;
}

function getUserDisplayName(user) {
  const fullName = [user.first_name || '', user.last_name || ''].join(' ');

  if (fullName !== ' ') {
    return fullName;
  } else {
    return user.username;
  }
}
