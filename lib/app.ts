import * as restify from "restify";
import * as builder from "botbuilder";
import * as request from "request-promise";

/*
 * Import extracted cards functions.
 */
var cards = require("./cards");

/*
 * Import extracted middleware functions
 */
var middleware = require("./middleware");

/*
 * Import extracted token functions
 */
var token = require("./token");

/*
 * Function to start a restify application for routing messaging requests.
 */
function startServer(): void {
    var server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, () => {
        console.log("%s listening to %s", server.name, server.url);
        startBot(server);
    });
}

/*
 * This function creates the chat connector and universal bot.
 * If an App ID and App Password are available in the environment, it will pass it to the connector.
 * Bot messages are listened for at /api/messages.
 */
function startBot(server: restify.Server): void {
    var conn = new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    });
    var bot = new builder.UniversalBot(conn);
    /*
     * Messages between the user and the bot can be intercepted through middleware integration.
     * The botbuilder() function represents messages to the user.
     * The send() function represents messages to the bot.
     * Here we're passing the session, event, and next function to an external module of exported functions.
     */
    bot.use({
        botbuilder: (sess, next) => {
            middleware.inbound(sess, next);
        }
        ,send: (evt, next) => {
            middleware.outbound(evt, next);
        }
    });
    server.post("/api/messages", conn.listen());
    buildDialogs(bot);
}

/*
 * Function to build out the various dialogs used in this example.
 */
function buildDialogs(bot: builder.UniversalBot): void {
    /*
     * Intents are a way to capture user input via regular expressions and attempt to match them to dialogs.
     * The initial intents objects is passed to the root dialog.
     */
    var intents = new builder.IntentDialog();
    bot.dialog("/", intents);
    intents.matches(/school of medicine|^som$/i, (sess) => {
        sess.send("Hello from the UVA SOM IT team!");
    });
    intents.matches(/^cards$/i, (sess) => {
        sess.replaceDialog("/choice");
    });
    intents.matches(/^carousel$/i, (sess) => {
        /*
         * If you have a long running process, you can sending an indication to the user that typing is occurring.
         * Below, we use setTimeout() to mimic a longer running process.
         */
        sess.sendTyping();
        setTimeout(() => {
            sess.replaceDialog("/carousel");
        }, 3000);
    });
    intents.matches(/^talk/i, (sess) => {
        /*
         * Bots are not limited to text. You can have them speak too.
         */
        sess.say("I have nothing to say to you at this time.", `<voice xml:lang="en-gb" gender="female">I have <emphasis level="moderate">nothing</emphasis> to say to you at this time.</voice>`, {
                inputHint: builder.InputHint.ignoringInput
            }
        );
    });
    /*
     * If no intent is matched, the onDefault() is called.
     * This takes an array of functions, and uses the waterfall methodology for passing to the next function.
     */
    intents.onDefault([
        (sess, args, next) => {
            if (!sess.userData.name) {
                /*
                 * If the user's name is not in session, start the profile dialog.
                 * You can begin, end, and replace dialogs to construct your bot UI flow.
                 */
                sess.beginDialog("/profile");
            }
            else if(sess.message != null && sess.message.attachments.length > 0) {
                /*
                 * Bots can accept attachments such as images.
                 * The example below triggers when there is an attachment that is sent.
                 * It downloads the image and logs the content type and length to the dialog.
                 */
                let img = sess.message.attachments[0];
                let file = token.requiresToken(sess.message) ? token.requestWithToken(img.contentUrl) : request(img.contentUrl);
                file.then((resp) => {
                    let reply = new builder.Message(sess).text("Attachment of %s type and size of %s bytes received.", img.contentType, resp.length);
                    sess.send(reply);
                }).catch((err) => {
                    console.log(err);
                });
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
    /*
     * In addition to the waterfall methodology and intents, you can trigger dialogs based on regular expression
     * matches off of standard dialogs.
     */
    bot.dialog("/version", (sess, args, next) => {
        sess.endDialog("version 0.0.1");
    }).triggerAction({
        matches: /version/i
    });
}

/*
 * Start the server.
 */
startServer();
