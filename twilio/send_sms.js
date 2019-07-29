const accountSid = 'ACabd0e8c237fdbc51447f3b5e045ed50f';
const authToken = '519bbf4b865fe2c75742cd8cfe011760';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    from: '+16043306848',
    to: '+16043478550'
  })
  .then(message => console.log(message.sid));
