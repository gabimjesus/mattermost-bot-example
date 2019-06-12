/** https://api.mattermost.com */

module.exports = {
  findUserByUsername,
  findUserById,
  findManyUsersById,
  listPostReactions,
  getUserProfilePictureUrl,
  getUserDisplayName,
};

const env = require('./environment');
const axios = require('axios');

async function findUserByUsername(username) {
  const options = {
    headers: { Authorization: `Bearer ${env.apiToken}`},
  };

  const response = await axios.get(`${env.apiBaseUrl}/users/username/${username}`, options);
  return response.data;
}

async function findUserById(userId) {
  const options = {
    headers: { Authorization: `Bearer ${env.apiToken}`},
  };

  const response = await axios.get(`${env.apiBaseUrl}/users/${userId}`, options);
  return response.data;
}

async function findManyUsersById(userIds) {
  if (!userIds || !userIds.length) {
    return [];
  }

  const options = {
    headers: { Authorization: `Bearer ${env.apiToken}`},
  };

  const response = await axios.post(`${env.apiBaseUrl}/users/ids`, userIds, options);
  return response.data;
}

async function listPostReactions(postId) {
  const options = {
    headers: { Authorization: `Bearer ${env.apiToken}`},
  };

  const response = await axios.get(`${env.apiBaseUrl}/posts/${postId}/reactions`, options);
  return response.data;
}

function getUserProfilePictureUrl(userId) {
  return `${env.apiBaseUrl}/users/${userId}/image`;
}

function getUserDisplayName(user) {
  const fullName = [user.first_name || '', user.last_name || ''].join(' ');

  if (fullName !== ' ') {
    return fullName;
  } else {
    return user.username;
  }
}
