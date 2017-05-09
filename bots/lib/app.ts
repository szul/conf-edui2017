import * as restify from "restify";
import * as builder from "botbuilder";

function startServer(): void {
    var server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, () => {
        console.log('%s listening to %s', server.name, server.url);
        startBot(server);
    });
}

function startBot(server: restify.Server): void {
    var conn = new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    });
    var bot = new builder.UniversalBot(conn);
    server.post('/api/messages', conn.listen());
    buildDialogs(bot);
}

function buildDialogs(bot: builder.UniversalBot): void {
    bot.dialog('/', [
        (sess, args, next) => {
            if (!sess.userData.name) {
                sess.beginDialog('/profile');
            } else {
                next();
            }
        },
        (sess, results) => {
            sess.send('Hello %s!', sess.userData.name);
        }
    ]);

    bot.dialog('/profile', [
        (sess) => {
            builder.Prompts.text(sess, 'Hello user! What may we call you?');
        },
        (sess, results) => {
            sess.userData.name = results.response;
            sess.endDialog();
        }
    ]);
}

startServer();
