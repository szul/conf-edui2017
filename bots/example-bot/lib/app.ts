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
    intents.onDefault([
        (sess, args, next) => {
            sess.replaceDialog("/init");
        }
    ]);
    bot.dialog("/init", [
        (sess, args, next) => {
            if (!sess.userData.name) {
                sess.beginDialog("/profile");
            }
            else {
                next();
            }
        },
        (sess, args, next) => {
            builder.Prompts.text(sess, "What may we help you with?");
        },
        (sess, results) => {
            sess.replaceDialog("/choice");
        }
    ]);
    bot.dialog("/profile", [
        (sess) => {
            builder.Prompts.text(sess, "Hello user! What may we call you?");
        },
        (sess, results) => {
            sess.send("Hello %s!", results.response);
            sess.endDialog();
        }
    ]);
    bot.dialog("/choice", [
        (sess) => {
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
}

startServer();
