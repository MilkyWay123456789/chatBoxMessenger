require('dotenv').config();
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
let callSendApi = (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

let handleWithStarted = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = { "text": "Xin chào bạn đến với MilkyWay" }
            await callSendApi(sender_psid, response);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleWithStarted: handleWithStarted
}