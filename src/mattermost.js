/** https://api.mattermost.com */

module.exports = {
  findUserByUsername,
  findUserById,
  findManyUsersById,
  listPostReactions,
  getUserProfilePictureUrl,
  getUserDisplayName,
};

const axios = require('axios');

const {
  apiToken,
  apiBaseUrl,
} = require('./environment');

async function findUserByUsername(username) {
  const options = {
    headers: { Authorization: `Bearer ${apiToken}`},
  };

  const response = await axios.get(`${apiBaseUrl}/users/username/${username}`, options);
  return response.data;
}

async function findUserById(userId) {
  const options = {
    headers: { Authorization: `Bearer ${apiToken}`},
  };

  const response = await axios.get(`${apiBaseUrl}/users/${userId}`, options);
  return response.data;
}

async function findManyUsersById(userIds) {
  if (!userIds || !userIds.length) {
    return [];
  }

  const options = {
    headers: { Authorization: `Bearer ${apiToken}`},
  };

  const response = await axios.post(`${apiBaseUrl}/users/ids`, userIds, options);
  return response.data;
}

async function listPostReactions(postId) {
  const options = {
    headers: { Authorization: `Bearer ${apiToken}`},
  };

  const response = await axios.get(`${apiBaseUrl}/posts/${postId}/reactions`, options);
  return response.data;
}

function getUserProfilePictureUrl(userId) {
  return `${apiBaseUrl}/users/${userId}/image`;
}

function getUserDisplayName(user) {
  if (user.first_name && user.last_name) {
    // Tem os dois, first e last
    return user.first_name + ' ' + user.last_name;
  }

  const name = user.first_name || user.last_name;

  if (name) {
    // Tem um, mas não o outro (tanto faz qual)
    return name;
  } else {
    // Não tem nem first, nem last
    return user.username;
  }
}
