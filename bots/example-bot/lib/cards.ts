import * as builder from "botbuilder";

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

export function createAnimationCard(sess: builder.Session): builder.AnimationCard {
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

export function createThumbnailCard(sess: builder.Session): builder.ThumbnailCard {
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

export function createHeroCard(sess: builder.Session): builder.HeroCard {
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

export function createSigninCard(sess: builder.Session): builder.SigninCard {
    return new builder.SigninCard(sess)
        .text("Sign-In Card")
        .button("Sign-in", "TARGET_LOGIN_URL")
}
