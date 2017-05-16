import * as builder from "botbuilder";

/*
 * The Bot Framework offers the ability to intercept messages.
 * Below are extracted functions for handling message intercepts.
 * The data is logged to the console, and then the dialog is continued through the next() function.
 */

export function inbound(sess: builder.Session, next: Function): void {
    console.log(`Inbound message: ${sess.message.text}`);
    next();
}

export function outbound(evt: builder.IEvent, next: Function): void {
    console.log(`Outbound message: ${(<any>evt).text}`);
    next();
}
