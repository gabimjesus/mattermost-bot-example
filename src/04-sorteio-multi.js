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

const { port, helpBaseUrl } = require('./environment');


async function botHandler(req, res) {
  console.log(req.body);

  const { isHelp, postId, what, numberOfWinners, wantedReactions, isPublic } = parseArguments(req.body.text);

  if (isHelp) {
    res.send(helpMessageJson(req.body.command));
    return;
  }

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

  const winnerPictures = winnerUsers
  // .filter(user => user.last_picture_update)  // Só mostra usuários que definiram uma foto
    .map(user => `![winner](${getUserProfilePictureUrl(user.id)} "winner")`);

  const lines = [
    `\`${req.body.command} ${req.body.text}\``,
    `sorteado por: @${req.body.user_name}`,
    `#### Sorteio: ${what}`,
  ];

  if (winnerUsers.length === 1) {
    lines.push(`## Vencedor: @${winnerUsers[0].username}`)
  } else {
    const winnerDisplayNames = winnerUsers.map((user, i) => `${i + 1}. @${user.username}`);
    lines.push('## Vencedores');
    lines.push(...winnerDisplayNames);
  }

  lines.push(winnerPictures.join(''));

  const message = lines.join('\n');

  res.status(200).json({
    username: 'Bot do Sorteio (2)',
    icon_url: 'https://files.catbox.moe/dpfetu.jpeg',
    text: message,
    response_type: isPublic ? 'in_channel' : 'ephemeral',
  });
}

function parseArguments(message) {
  const arguments = message.split(' ').filter(s => s);
  const [permalink, what, numberOfWinnersString, reactionsString, isPublicString] = arguments;

  if (!permalink || permalink.toLowerCase() === 'help') {
    return { isHelp: true };
  }

  // Exemplo de permalink: https://im.dominio.com.br/time/pl/00001111222233334444555566
  const postId = permalink.split('/pl/')[1];

  if (!postId) {
    throw new Error(`Id do post é inválido: ${postId}`);
  }

  const numberOfWinners = Math.max(1, parseInt(numberOfWinnersString || '0', 10));

  let wantedReactions = [];

  if (reactionsString && reactionsString.toLowerCase() !== 'any') {
    // Exemplos de valores de reactionsString: undefined, ":thumbsup:", ":+1:,:thumbsup:", "thumbsup"
    wantedReactions = reactionsString
      .replace(/:/g, '')
      .split(',')
      .filter(s => s);
  }

  // isPublic => todo mundo pode ver
  const trueValues = ['public', 'yes', 'true', '1'];
  const isPublic = Boolean(isPublicString) && trueValues.includes(isPublicString.toLowerCase());

  return { isHelp: false, postId, what, numberOfWinners, wantedReactions, isPublic };
}

function shuffle(array) {
  for (let i = 0; i < array.length; i++) {
    let j = i + Math.floor(Math.random() * (array.length - i));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function helpMessageJson(command) {
  return {
    username: 'Bot do Sorteio (2)',
    icon_url: 'https://files.catbox.moe/dpfetu.jpeg',
    text: [
      `\`${command} permalink item-sorteado número-vencedores reações é-publico?\``,
      'permalink: permalink do post com as reações de quem vai participar',
      'item-sorteado: qualquer palavra sem espaços',
      'número-vencedores: número de vencedores',
      'reações: pode ser any para pegar todas, ou uma lista separado com vírgulas. Por exemplo: `:thumbsup:,:+1:,:heart:`',
      'é-publico?: diz se o sorteio aparece só para você ou todo mundo no chat. Os valores public, yes, true e 1 fazem aparecer no chat',
      'Exemplos:',
      `\`${command} ${helpBaseUrl}/pl/00001111222233334444555566 Bolo 1 :heart:\``,
      `\`${command} ${helpBaseUrl}/pl/00001111222233334444555566 Marmita 3 :heart:,:thumbsup: public\``,
      `\`${command} ${helpBaseUrl}/pl/00001111222233334444555566 Pamonha 10 any public\``,
    ].join('\n'),
    response_type: 'ephemeral',
  };
}

// Necessário pois o express não vai dar .catch() na Promise retornada pelo handler async
function wrapAsyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/hello', verifyAccessToken);

app.post('/hello', wrapAsyncHandler(botHandler));

app.use('/hello', sendExceptionAsChatMessage);

app.listen(port);
console.log('Listening on port', port);
