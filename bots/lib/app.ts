import * as restify from "restify";
import * as builder from "botbuilder";

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

function createVideoCard(sess: builder.Session): builder.VideoCard {
    return new builder.VideoCard(sess)
        .title("")
        .subtitle("")
        .text("")
        .image(builder.CardImage.create(sess, "https://yt3.ggpht.com/-cnBYz6wq0mI/AAAAAAAAAAI/AAAAAAAAAAA/lcXH-518deI/s176-c-k-no-mo-rj-c0xffffff/photo.jpg"))
        .media(<any>[
            { 
                url: "https://youtu.be/iXF4nhhN3NY?list=PLM7E2OfCPpfrEvxM9JvImU7LLl30aPrkd"
            }
    ]);
}

function createAnimationCard(sess: builder.Session): builder.AnimationCard {
    return new builder.AnimationCard(sess)
        .title("")
        .subtitle("")
        .image(builder.CardImage.create(sess, "https://yt3.ggpht.com/-cnBYz6wq0mI/AAAAAAAAAAI/AAAAAAAAAAA/lcXH-518deI/s176-c-k-no-mo-rj-c0xffffff/photo.jpg"))
        .media(<any>[
            {
                url: "https://media.giphy.com/media/HrB1MUATg24Ra/giphy.gif"
            }
        ]);
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

function createHeroCard(sess: builder.Session): builder.HeroCard {
    return new builder.HeroCard(sess)
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

function createSigninCard(sess: builder.Session): builder.SigninCard {
    return new builder.SigninCard(sess)
        .text("Sign-In Card")
        .button("Sign-in", "TARGET_LOGIN_URL")
}

function buildDialogs(bot: builder.UniversalBot): void {
    bot.dialog("/", [
        (sess, args, next) => {
            if (!sess.userData.name) {
                sess.beginDialog("/profile");
            }
            else {
                next();
            }
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
            builder.Prompts.choice(sess, "What may we help you with?", [
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
                    sess.send(new builder.Message(sess).addAttachment(createAudioCard(sess)));
                    break;
                case "Video Card":
                    sess.send(new builder.Message(sess).addAttachment(createVideoCard(sess)));
                    break;
                case "Animation Card":
                    sess.send(new builder.Message(sess).addAttachment(createAnimationCard(sess)));
                    break;
                case "Thumbnail Card":
                    sess.send(new builder.Message(sess).addAttachment(createThumbnailCard(sess)));
                    break;
                case "Hero Card":
                    sess.send(new builder.Message(sess).addAttachment(createHeroCard(sess)));
                    break;
                case "Sign-In Card":
                    sess.send(new builder.Message(sess).addAttachment(createSigninCard(sess)));
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
