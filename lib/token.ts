import * as builder from "botbuilder";
import * as request from "request-promise";
import * as promise from "bluebird";

export function requestWithToken(conn: builder.ChatConnector, url: string): request.RequestPromise {
    return (<any>promise.promisify(conn.getAccessToken.bind(conn))).then((token) => {
        return request({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/octet-stream'
            }
        });
    });
}

export function requiresToken(msg): boolean {
    return msg.source === "skype" || msg.source === "msteams";
}
