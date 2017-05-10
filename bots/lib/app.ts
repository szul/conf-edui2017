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

function createAudioCard(sess: builder.Session): builder.AudioCard {
    return new builder.AudioCard(sess)
        .title("Programmable Bots and the Microsoft Bot Framework")
        .subtitle("")
        .text("Bots are all the rage, and the conversation UI is starting to enter the lexicon of technology conference speakers, marketing departments, and hacker...")
        .image(builder.CardImage.create(sess, "https://szul.blob.core.windows.net/images/codepunk-013-programmable-bots-and-header.png"))
        .media(<any>[
            {
                url: "https://media.blubrry.com/codepunk/archive.org/download/CodepunkEpisode013/Codepunk-Episode-013.mp3"
            }
    ]);
}

function createVideoCard(): any {

}

function createThumbnailCard(sess: builder.Session): builder.ThumbnailCard {
return new builder.ThumbnailCard(sess)
        .title("")
        .subtitle("")
        .text("")
        .images([
            builder.CardImage.create(sess, "IMAGE_URL")
        ])
        .buttons([
            builder.CardAction.openUrl(sess, "TARGET_LINK", "Read more...")
]);
}

function createHeroCard(): any {

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
