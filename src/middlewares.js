module.exports = {
  verifyAccessToken,
  sendExceptionAsChatMessage,
};

const { allowedAccessTokens } = require('./environment');

/** Só deixa passar requisições com o token de acesso válido do slash-command */
function verifyAccessToken(req, res, next) {
  const token = req.body.token;

  if (!token || !allowedAccessTokens.includes(token)) {
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
}

/** Caso uma exceção seja jogada, retorna uma mensagem com o erro no chat
 *  Precisa estar depois do app.post e receber exatamente 4 argumentos para ser um error handler do express
 *  Se tirar o argumento next não funciona mais
 */
function sendExceptionAsChatMessage(err, req, res, next) {
  const icon_urls = [
    'https://im.tokenlab.com.br/static/emoji/2049-fe0f.png',
    'https://im.tokenlab.com.br/static/emoji/1f525.png',
    'https://im.tokenlab.com.br/static/emoji/1f4a5.png',
    'https://im.tokenlab.com.br/static/emoji/1f4a3.png',
    'https://im.tokenlab.com.br/static/emoji/2620-fe0f.png',
    'https://im.tokenlab.com.br/static/emoji/1f4a9.png',
    'https://im.tokenlab.com.br/static/emoji/1f494.png',
    'https://im.tokenlab.com.br/static/emoji/1f198.png',
  ];

  const command = req && req.body && req.body.command;
  const stackTrace = err && err.stack;

  const iconIndex = Math.floor(Math.random() * icon_urls.length);

  console.error(err);

  res.json({
    username: `Exception caught on ${command}`,
    icon_url: icon_urls[iconIndex],
    text: '```js\n' + stackTrace + '\n```',
    response_type: 'ephemeral',
  });
}
