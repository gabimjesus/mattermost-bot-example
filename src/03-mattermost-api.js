/* https://developers.mattermost.com/integrate/slash-commands/#basic-usage
 * https://developers.mattermost.com/integrate/slash-commands/#parameters
 * https://docs.mattermost.com/developer/message-attachments.html#example-message-attachment
 */

const express = require('express');
const bodyParser = require('body-parser');

const {
  verifyAccessToken,
  sendExceptionAsChatMessage,
} = require('./middlewares');

const {
  findUserByUsername,
  getUserDisplayName,
  getUserProfilePictureUrl,
} = require('./mattermost');

const { port } = require('./environment');


async function botHandler(req, res) {
  console.log(req.body);

  const splittedText = req.body.text.split(' ');

  const username = splittedText.shift().replace(/@/g, '');
  const message = splittedText.join(' ');

  const user = await findUserByUsername(username);

  res.json({
    username: getUserDisplayName(user),
    icon_url: getUserProfilePictureUrl(user.id),
    text: message,
    response_type: 'in_channel',
  });
}

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/hello', verifyAccessToken);

app.post('/hello', async (req, res, next) => {
  try {
    await botHandler(req, res);
  } catch (err) {
    // Necessário pois o express não vai dar .catch() na Promise retornada pelo handler async
    next(err);
  }
});

app.use('/hello', sendExceptionAsChatMessage);

app.listen(port);
console.log('Listening on port', port);
