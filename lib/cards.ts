import * as builder from "botbuilder";

/*
 * The Bot Framework offers several rich cards that can be sent back to the user.
 * Below there are several functions that construct and then return various cards to be sent
 * as attachments in messages.
 */

export function createAudioCard(sess: builder.Session): builder.AudioCard {
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

export function createVideoCard(sess: builder.Session): builder.VideoCard {
    return new builder.VideoCard(sess)
        .title("Experimenting with Bots")
        .subtitle("")
        .text("")
         .image(builder.CardImage.create(sess, "https://i.ytimg.com/vi/xHaBZkBYrcE/hqdefault.jpg?custom=true&w=246&h=138&stc=true&jpg444=true&jpgq=90&sp=67&sigh=uq6WYI3DVbfUA8koawZeFo22MIc"))
        .media(<any>[
            { 
                url: "https://youtu.be/xHaBZkBYrcE"
            }
    ]);
}

export function createAnimationCard(sess: builder.Session): builder.AnimationCard {
    return new builder.AnimationCard(sess)
        .title("This is a Hamster Eating")
        .subtitle("")
        .image(builder.CardImage.create(sess, "https://yt3.ggpht.com/-cnBYz6wq0mI/AAAAAAAAAAI/AAAAAAAAAAA/lcXH-518deI/s176-c-k-no-mo-rj-c0xffffff/photo.jpg"))
        .media(<any>[
            {
                url: "https://media.giphy.com/media/HrB1MUATg24Ra/giphy.gif"
            }
        ]);
}

export function createThumbnailCard(sess: builder.Session): builder.ThumbnailCard {
    return new builder.ThumbnailCard(sess)
        .title("Glorious")
        .subtitle("")
        .text("The problem with being the best is that someone will always eventually come along that is better. That's why I've settled on just being glorious.")
        .images([
            builder.CardImage.create(sess, "https://szul.blob.core.windows.net/images/about-szul.jpg")
        ])
        .buttons([
            builder.CardAction.openUrl(sess, "https://codepunk.io/about/", "Read more...")
    ]);
}

export function createHeroCard(sess: builder.Session): builder.HeroCard {
    return new builder.HeroCard(sess)
        .title("From TypeScript to C# and Back Again")
        .subtitle("")
        .text("")
        .images([
            builder.CardImage.create(sess, "https://szul.blob.core.windows.net/images/from-typescript-to-c-header.jpg")
        ])
        .buttons([
            builder.CardAction.openUrl(sess, "https://codepunk.io/from-typescript-to-c-scripting-and-back-again/", "Read more...")
        ]);
}

export function createSigninCard(sess: builder.Session): builder.SigninCard {
    return new builder.SigninCard(sess)
        .text("Sign-In Card")
        .button("Sign-in", "https://google.com")
}
