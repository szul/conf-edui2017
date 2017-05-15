import * as restify from "restify";
import * as builder from "botbuilder";

var cards = require("./cards");

function startServer(): void {
    var server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, () => {
        console.log("%s listening to %s", server.name, server.url);
        startBot(server);
    });
}

function startBot(server: restify.Server): void {
    var conn = new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    });
    var bot = new builder.UniversalBot(conn);
    server.post("/api/messages", conn.listen());
    buildDialogs(bot);
}

function buildDialogs(bot: builder.UniversalBot): void {
    var intents = new builder.IntentDialog();
    bot.dialog("/", intents);
    intents.matches(/school of medicine|^som$/i, (sess) => {
        sess.send("Hello from the UVA SOM IT team!");
    });
    intents.matches(/^cards$/i, (sess) => {
        sess.replaceDialog("/choice");
    });
    intents.matches(/^carousel$/i, (sess) => {
        sess.replaceDialog("/carousel");
    });
    intents.onDefault([
        (sess, args, next) => {
            if (!sess.userData.name) {
                sess.beginDialog("/profile");
            }
            else {
                next();
            }
        },
        (sess, results) => {
            sess.send(`Hello ${sess.userData.name}! What may we help you with?`);
        }
    ]);
    bot.dialog("/profile", [
        (sess, args, next) => {
            builder.Prompts.text(sess, "Hello user! What may we call you?");
        },
        (sess, results) => {
            sess.userData.name = results.response;
            sess.endDialog();
        }
    ]);
    bot.dialog("/choice", [
        (sess, args, next) => {
            builder.Prompts.choice(sess, "Pick a dialog.", [
                "Audio Card"
                ,"Video Card"
                ,"Animation Card"
                ,"Thumbnail Card"
                ,"Hero Card"
                ,"Sign-In Card"
                ,"Exit"
            ]);
        },
        (sess, results) => {
            switch (results.response.entity) {
                case "Audio Card":
                    sess.send(new builder.Message(sess).addAttachment(cards.createAudioCard(sess)));
                    break;
                case "Video Card":
                    sess.send(new builder.Message(sess).addAttachment(cards.createVideoCard(sess)));
                    break;
                case "Animation Card":
                    sess.send(new builder.Message(sess).addAttachment(cards.createAnimationCard(sess)));
                    break;
                case "Thumbnail Card":
                    sess.send(new builder.Message(sess).addAttachment(cards.createThumbnailCard(sess)));
                    break;
                case "Hero Card":
                    sess.send(new builder.Message(sess).addAttachment(cards.createHeroCard(sess)));
                    break;
                case "Sign-In Card":
                    sess.send(new builder.Message(sess).addAttachment(cards.createSigninCard(sess)));
                    break;
            }
            if(results.response.entity === "Exit") {
                sess.replaceDialog("/");
            }
            else {
                sess.replaceDialog("/choice");
            }
        }
    ]);
    bot.dialog("/carousel", [
        (sess, args, next) => {
            var c = [
                 cards.createHeroCard(sess)
                ,cards.createHeroCard(sess)
                ,cards.createHeroCard(sess)
            ];
            var msg = new builder.Message(sess).attachmentLayout(builder.AttachmentLayout.carousel).attachments(c);
            sess.send(msg);
            sess.endDialog();
        }
    ]);
    bot.dialog("version", (sess, args, next) => {
        sess.endDialog("version 0.0.1");
    }).triggerAction({
        matches: /version/
    });
}

startServer();
