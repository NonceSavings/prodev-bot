const { App, ExpressReceiver } = require('@slack/bolt');
const dotenv = require('dotenv')
// const express = require('express');
// Use ExpressReceiver for custom routes
dotenv.config({})

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SECRET });
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

// Handle the challenge request
receiver.router.post('/slack/events', (req, res) => {
  const body = req.body;
  if (body.type === 'url_verification') {
    res.status(200).json({ challenge: body.challenge });
  } else {
    res.status(200).send('OK'); // Acknowledge other events
  }
});

// Handle "hello" messages
slackApp.message('hello', async ({ message, say }) => {
  await say(`Hello <@${message.user}>! How can I assist you today?`);
});

// Start the app
(async () => {
  await slackApp.start(process.env.PORT || 3000);
  console.log('HelloBot is running on port 3000!');
})();