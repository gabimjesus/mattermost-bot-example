/* https://developers.mattermost.com/integrate/slash-commands/#basic-usage
 * https://developers.mattermost.com/integrate/slash-commands/#parameters
 * https://docs.mattermost.com/developer/message-attachments.html#example-message-attachment
 */

const express = require('express');
const bodyParser = require('body-parser');

const port = parseInt(process.env.PORT || 8080, 10);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/hello', (req, res) => {
  console.log(req.query);
  
  res.json({
    text: 'Hello GET',
  });
});

app.post('/hello', (req, res) => {
  console.log(req.body);
  
  res.json({
    text: 'Hello POST',
  });
});

app.listen(port);
console.log('Listening on port', port);
