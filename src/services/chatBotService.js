require('dotenv').config();
import request from "request";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = 'https://bit.ly/3YSwBKR';
const IMAGE_LIST_BOOK = 'https://bit.ly/3I7lVlH';
const IMAGE_OPEN = 'https://bit.ly/3vnqAs7';
const IMAGE_CHANGE_BOOK = 'https://bit.ly/3jI0nla';
const IMAGE_ISEKAI = 'https://bit.ly/3C6cBKL';
const IMAGE_FANTASY = 'https://bit.ly/3G1CvAQ';
const IMAGE_SLICE = 'https://bit.ly/3Z0BSjm';
const IMAGE_DORAEMON = 'https://bit.ly/3Q1nQKh';
const IMAGE_FAIRYTAIL = 'https://bit.ly/3voxi0P';
const IMAGE_ONEPIECE = 'https://bit.ly/3VwPHn0';
const IMAGE_BACK = 'https://bit.ly/3Z1aNg0'
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

let getUserName = (sender_psid) => {
    return new Promise((resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                body = JSON.parse(body)
                let username = `${body.last_name} ${body.first_name}`;
                resolve(username)
            } else {
                console.error("Unable to send message:" + err);
                reject(err)
            }
        });
    })
}

let handleWithStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let responseName = { "text": `Xin chào bạn ${username} đến với MilkyWay` }
            let responseTem = sendGetStartedTemplate();
            //send text message
            await callSendApi(sender_psid, responseName);
            //send generic message template
            await callSendApi(sender_psid, responseTem);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

let sendGetStartedTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Welcome to bookstore Milkyway",
                    "subtitle": "Choose the option",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "LIST BOOK",
                            "payload": "MAIN_BOOK",
                        },
                        {
                            "type": "postback",
                            "title": "ORDER BOOK",
                            "payload": "ORDER_BOOK",
                        },
                        {
                            "type": "postback",
                            "title": "GUIDE",
                            "payload": "GUIDE_TO_USE",
                        }
                    ],
                }]
            }
        }
    }
    return response;
}

let handleSendListBook = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseTem = sendListBookTemplate();
            //send generic message template
            await callSendApi(sender_psid, responseTem);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

let sendListBookTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "List Book Milkyway",
                        "subtitle": "We are please to offer you a list book",
                        "image_url": IMAGE_LIST_BOOK,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "NOVEL",
                                "payload": "NOVEL",
                            },
                            {
                                "type": "postback",
                                "title": "MANGA",
                                "payload": "MANGA",
                            },
                        ],
                    },
                    {
                        "title": "Open Hour",
                        "subtitle": "MON-FRI 8AM-9AM | SAR 9AM-10AM | SUN 10AM-11AM",
                        "image_url": IMAGE_OPEN,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "ORDER BOOK",
                                "payload": "ORDER_BOOK",
                            },
                        ],
                    },
                    {
                        "title": "Change book",
                        "subtitle": "We are willing to accept book exchanges",
                        "image_url": IMAGE_CHANGE_BOOK,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "CHANGE BOOK",
                                "payload": "CHANGE_BOOK",
                            },
                        ],
                    },
                ]
            }
        }
    }
    return response;
}

let handleSendNovel = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseTem = sendNovelTemplate();
            //send generic message template
            await callSendApi(sender_psid, responseTem);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

let sendNovelTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Isekai",
                        "subtitle": "We have isekai hot novel",
                        "image_url": IMAGE_ISEKAI,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "VIEW DETAILS",
                                "payload": "VIEW_NOVEL",
                            },
                        ],
                    },
                    {
                        "title": "Fantasy",
                        "subtitle": "We have fantasy novel",
                        "image_url": IMAGE_FANTASY,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "VIEW DETAILS",
                                "payload": "VIEW_FANTASY",
                            },
                        ],
                    },
                    {
                        "title": "Slice of Slice",
                        "subtitle": "We have a lot of slice of slice novel",
                        "image_url": IMAGE_SLICE,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "VIEW DETAILS",
                                "payload": "VIEW_SLICEOFSLICE",
                            },
                        ],
                    },
                    {
                        "title": "Go back",
                        "subtitle": "Go back to list book",
                        "image_url": IMAGE_BACK,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "GO BACK",
                                "payload": "BACK_TO_LIST_BOOK",
                            },
                        ],
                    },
                ]
            }
        }
    }
    return response;
}

let handleSendManga = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseTem = sendMangaTemplate();
            //send generic message template
            await callSendApi(sender_psid, responseTem);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

let sendMangaTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Doraemon",
                        "subtitle": "We have list of doraemon manga",
                        "image_url": IMAGE_DORAEMON,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "VIEW DETAILS",
                                "payload": "VIEW_DORAEMON",
                            },
                        ],
                    },
                    {
                        "title": "Fairy tails",
                        "subtitle": "We have manga Fairy tails",
                        "image_url": IMAGE_FAIRYTAIL,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "VIEW DETAILS",
                                "payload": "VIEW_FAIRYTAIL",
                            },
                        ],
                    },
                    {
                        "title": "One piece",
                        "subtitle": "We have One piece manga",
                        "image_url": IMAGE_ONEPIECE,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "VIEW DETAILS",
                                "payload": "VIEW_ONEPIECE",
                            },
                        ],
                    },
                ]
            }
        }
    }
    return response;
}

module.exports = {
    handleWithStarted: handleWithStarted,
    handleSendListBook: handleSendListBook,
    handleSendNovel: handleSendNovel,
    handleSendManga: handleSendManga
}