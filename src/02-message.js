/* https://developers.mattermost.com/integrate/slash-commands/#basic-usage
 * https://developers.mattermost.com/integrate/slash-commands/#parameters
 * https://docs.mattermost.com/developer/message-attachments.html#example-message-attachment
 */

const express = require('express');
const bodyParser = require('body-parser');


function botHandler(req, res) {
  console.log(req.body);

  res.json({
    username: 'Botson da Silva',
    icon_url: 'https://im.tokenlab.com.br/static/emoji/1f916.png',
    text: '## Tá funcionando :ok_hand:\n_(se ainda não percebeu, eu sou um robô)_',
    response_type: 'in_channel',
  });
}


const port = parseInt(process.env.PORT || '8080', 10);
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/hello', botHandler);

app.listen(port);
console.log('Listening on port', port);
