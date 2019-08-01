const accountSid = 'ACabd0e8c237fdbc51447f3b5e045ed50f';
const authToken = '519bbf4b865fe2c75742cd8cfe011760';
const client = require('twilio')(accountSid, authToken);

function sendMessage(messageData) {
  return client.messages.create({
    body: `Hi ${messageData.body.userName},
    Thanks for ordering with LightResto.
    Your food is ready for pickup`,
    from: '+16043306848',
    to: `+1${messageData.body.sendText}`
  })
}

module.exports = { sendMessage };
