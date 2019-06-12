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
  listPostReactions,
  findManyUsersById,
  getUserProfilePictureUrl,
} = require('./mattermost');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/hello', verifyAccessToken);

app.post('/hello', async (req, res, next) => {
  try {
    console.log(req.body);

    const { postId, numberOfWinners, wantedReactions, isPublic } = parseArguments(req.body.text);

    let postReactions = await listPostReactions(postId);

    // Se nao for passado wantedReactions, considera todas as reações
    if (wantedReactions.length) {
      postReactions = postReactions.filter(reaction => wantedReactions.includes(reaction.emoji_name));
    }

    // Remove usuários duplicados
    const userIds = Array.from(new Set(postReactions.map(reaction => reaction.user_id)));

    if (!userIds.length) {
      throw new Error('Nenhum usuário reagiu');
    }

    const winnerIds = shuffle(userIds).slice(0, numberOfWinners);
    const winnerUsers = await findManyUsersById(winnerIds);

    const winnerDisplayNames = winnerUsers.map((user, i) => `${i + 1}. @${user.username}`);

    const winnerPictures = winnerUsers
      // .filter(user => user.last_picture_update)  // Só mostra usuários que definiram uma foto
      .map(user => `![winner](${getUserProfilePictureUrl(user.id)} "winner")`);

    const message = [
      `\`${req.body.command} ${req.body.text}\``,
      `sorteado por: @${req.body.user_name}`,
      ...winnerDisplayNames,
      winnerPictures.join(''),
    ].join('\n');

    res.status(200).json({
      username: 'Bot do Sorteio (2)',
      icon_url: 'https://files.catbox.moe/dpfetu.jpeg',
      text: message,
      response_type: isPublic ? 'in_channel' : 'ephemeral',
    });
  } catch(err) {
    next(err);
  }
});

app.use('/hello', sendExceptionAsChatMessage);

const env = require('env');
app.listen(env.port);
console.log('Listening on port', env.port);


function parseArguments(message) {
  const arguments = message.split(' ').filter(s => s);
  const [permalink, numberOfWinnersString, reactionsString, isPublicString] = arguments;

  // Exemplo de permalink: https://im.tokenlab.com.br/tokenlab/pl/00001111222233334444555566
  const postId = permalink.split('/pl/')[1];

  if (!postId) {
    throw new Error(`Id do post é inválido: ${postId}`);
  }

  const numberOfWinners = Math.max(1, parseInt(numberOfWinnersString || '0', 10));

  let wantedReactions = [];

  if (reactionsString) {
    // Exemplos de valores de reactionsString: undefined, ":thumbsup:", ":+1:,:thumbsup:", "thumbsup"
    wantedReactions = reactionsString.replace(/:/g, '').split(',');
  }

  // isPublic => todo mundo pode ver
  const trueValues = ['public', 'yes', 'true', '1'];
  const isPublic = Boolean(isPublicString) && trueValues.includes(isPublicString.toLowerCase());

  return { postId, numberOfWinners, wantedReactions, isPublic };
}

function shuffle(array) {
  for (let i = 0; i < array.length; i++) {
    let j = i + Math.floor(Math.random() * (array.length - i));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
