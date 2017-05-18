# edUi Conference 2017 Presentation

This repo houses the coding examples and demos for my [edUi Conference](http://eduiconf.org) (2017) talk on [bots](http://eduiconf.org/sessions/building-bots-for-the-conversation-ui/).

A Summary of the talk can be found below. Additionally, the source for the [codepunk bot](https://github.com/codepunk-io/io.codepunk.bot) that will be shown at the presentation is also available in its own repository.

### Bots for the Conversation UI

Facebook Messenger, Skype, Slack, WhatsApp: messaging has become the heart and soul of the mobile device, and both Microsoft and Facebook have stressed the emergence of the conversation space as the next big frontier for the Internet. With the progress on artificial intelligence services, this means the growth of bots.

But what exactly is a bot, and how can it help you? This session will walk you through the bot basics and show you how easy it is to build a bot using the Microsoft Bot Framework. From start to finish, you’ll hear about the pieces you need to build a bot and launch it for various communication services.

Conversation is the next user interface.

What you’ll learn:

* The value of bots in the education space: providing rich, adaptable experiences for your library or website users.

* How to use the Microsoft Bot Framework and Microsoft’s connector APIs to launch a bot for Skype, Facebook, web chat, and more.

* How natural language processors like LUIS can add artificial intelligence to your bot with very little code from you.

* Stream audio and video, send directions, send specialized UI components called cards, and accept files for processing…straight from the bot!

### How to install and run

From a shell:

```
git clone https://github.com/szul/conf-edui2017-examplebot.git
cd conf-edui2017-examplebot
npm install
tsc -p tsconfig.json
node server.js
```
