require('dotenv').config();
import { response } from "express";
import request from "request";
import db from "../models/index"

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = 'https://bit.ly/3YSwBKR';
const IMAGE_LIST_BOOK = 'https://bit.ly/3I7lVlH';
const IMAGE_OPEN = 'https://bit.ly/3vnqAs7';
const IMAGE_CHANGE_BOOK = 'https://bit.ly/3jI0nla';
const IMAGE_BACK = 'https://bit.ly/3Z1aNg0';

const IMAGE_COTE = 'https://bit.ly/3IcgBNW';
const IMAGE_5CMS = 'https://bit.ly/3jFf4FE';
const IMAGE_YOURNAME = 'https://bit.ly/3WOzlYp';

const IMAGE_BERSERK = 'https://bit.ly/3Q4xmfC';
const IMAGE_GRIMGAS = 'https://bit.ly/3G29sgw';
const IMAGE_KONOSYBA = 'https://bit.ly/3YZaGS5';

const IMAGE_HORIMIYA = 'https://bit.ly/3FYdDK6';
const IMAGE_HIGENOWORU = 'https://bit.ly/3YZcACd';
const IMAGE_ANGELNEXTDOOR = 'https://bit.ly/3GsdZdg';

const IMAGE_CHANGE_DETAIL_BOOK = 'https://bit.ly/3CbMa6N';
const IMAGE_GIF_WELCOME = 'https://media0.giphy.com/media/LkjlH3rVETgsg/giphy.gif?cid=790b7611230b5e3e315e9c4a97fc73520ee929a8dee79369&rid=giphy.gif&ct=g';

let callSendApi = async (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Construct the message body
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response
            }

            await sendMarkReadMessage(sender_psid);
            await sendTypingOn(sender_psid);

            // Send the HTTP request to the Messenger Platform
            request({
                "uri": "https://graph.facebook.com/v2.6/me/messages",
                "qs": { "access_token": PAGE_ACCESS_TOKEN },
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve('message sent!')
                } else {
                    console.error("Unable to send message:" + err);
                }
            });
        } catch (e) {
            reject(e)
        }
    })
}

let sendTypingOn = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_on"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sendTypingOn sent!')
        } else {
            console.error("Unable to send sendTypingOn:" + err);
        }
    });
}

let sendMarkReadMessage = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "mark_seen"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sendTypingOn sent!')
        } else {
            console.error("Unable to send sendTypingOn:" + err);
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
            //let responseTem = sendGetStartedTemplate(sender_psid);
            let responseTem = getStartedQuickReplyTemplate(sender_psid);
            //send gif
            let responseImage = getStartedImageTemplate();
            //send text message
            await callSendApi(sender_psid, responseName);
            //send generic message template
            await callSendApi(sender_psid, responseImage);

            await callSendApi(sender_psid, responseTem);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

let sendGetStartedTemplate = (senderID) => {
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
                            "type": "web_url",
                            "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                            "title": "ORDER BOOK",
                            "webview_height_ratio": "tall",
                            "messenger_extensions": true,
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

let getStartedImageTemplate = () => {
    let response = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": IMAGE_GIF_WELCOME,
                "is_reusable": true
            }
        }
    }
    return response;
}

let getStartedQuickReplyTemplate = () => {
    let response = {
        "text": "Choose the option:",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "LIST BOOK",
                "payload": "MAIN_BOOK",
            },
            {
                "content_type": "text",
                "title": "GUIDE",
                "payload": "GUIDE_TO_USE",
            }
        ]
    }
    return response;
}

let handleSendListBook = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseTem = sendListBookTemplate(sender_psid);
            //send generic message template
            await callSendApi(sender_psid, responseTem);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

let sendListBookTemplate = (senderID) => {
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
                                "type": "web_url",
                                "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                                "title": "ORDER BOOK",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
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

let sendNovelTemplate = async () => {
    let data = await db.Product.findAll({
        where: { type: "NOVEL" },
        raw: true
    });

    let elements = [];
    if (data && data.length > 0) {
        data.map(item => {
            elements.push({
                "title": item.title,
                "subtitle": item.subtitle,
                "image_url": item.image_url,
                "buttons": [
                    {
                        "type": "postback",
                        "title": "VIEW DETAILS",
                        "payload": item.payload,
                    },
                ],
            })
        })
    }

    elements.push({
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
    })
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": []
            }
        }
    }

    response.attachment.payload.elements = elements;
    console.log(">>>check response", response.attachment.payload.elements)

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

let sendMangaTemplate = async () => {
    let data = await db.Product.findAll({
        where: { type: "MANGA" },
        raw: true
    });

    let elements = [];
    if (data && data.length > 0) {
        data.map(item => {
            elements.push({
                "title": item.title,
                "subtitle": item.subtitle,
                "image_url": item.image_url,
                "buttons": [
                    {
                        "type": "postback",
                        "title": "VIEW DETAILS",
                        "payload": item.payload,
                    },
                ],
            })
        })
    }

    elements.push({
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
    })
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": []
            }
        }
    }

    response.attachment.payload.elements = elements;
    console.log(">>>check response", response.attachment.payload.elements)

    return response;
}

let handleDetailNovel = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseTem = getDetailNovelTemplate(sender_psid);
            //send generic message template
            await callSendApi(sender_psid, responseTem);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailNovelTemplate = (senderID) => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Classroomm of elite",
                        "subtitle": "100.000 VND",
                        "image_url": IMAGE_COTE,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                                "title": "ORDER BOOK",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
                            },
                        ],
                    },
                    {
                        "title": "5CM/S",
                        "subtitle": "120.000 VND",
                        "image_url": IMAGE_5CMS,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                                "title": "ORDER BOOK",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
                            },
                        ],
                    },
                    {
                        "title": "Your Name",
                        "subtitle": "200.000 VND",
                        "image_url": IMAGE_YOURNAME,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                                "title": "ORDER BOOK",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
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

let handleDetailFantasy = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseTem = getDetailFantasyTemplate(sender_psid);
            //send generic message template
            await callSendApi(sender_psid, responseTem);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailFantasyTemplate = (senderID) => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Berserk of Guttony",
                        "subtitle": "150.000 VND",
                        "image_url": IMAGE_BERSERK,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                                "title": "ORDER BOOK",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
                            },
                        ],
                    },
                    {
                        "title": "GRIMGAS OF FANTASY",
                        "subtitle": "90.000 VND",
                        "image_url": IMAGE_GRIMGAS,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                                "title": "ORDER BOOK",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
                            },
                        ],
                    },
                    {
                        "title": "Konosuba",
                        "subtitle": "130.000 VND",
                        "image_url": IMAGE_KONOSYBA,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                                "title": "ORDER BOOK",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
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

let handleDetailSlice = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseTem = getDetailSliceTemplate(sender_psid);
            //send generic message template
            await callSendApi(sender_psid, responseTem);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailSliceTemplate = (senderID) => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Horimiya",
                        "subtitle": "80.000 VND",
                        "image_url": IMAGE_HORIMIYA,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                                "title": "ORDER BOOK",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
                            },
                        ],
                    },
                    {
                        "title": "Hige no woru",
                        "subtitle": "110.000 VND",
                        "image_url": IMAGE_HIGENOWORU,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                                "title": "ORDER BOOK",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
                            },
                        ],
                    },
                    {
                        "title": "Angel next door",
                        "subtitle": "130.000 VND",
                        "image_url": IMAGE_ANGELNEXTDOOR,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                                "title": "ORDER BOOK",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true,
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

let getImageChangBookTemplate = () => {
    let response = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": IMAGE_CHANGE_DETAIL_BOOK,
                "is_reusable": true
            }
        }
    }
    return response;
}

let getButtonTemplate = (senderID) => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "The book in bookstore is cheap",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "LIST BOOK",
                        "payload": "MAIN_BOOK",
                    },
                    {
                        "type": "web_url",
                        "url": `${process.env.URL_ORDER_BOOK}/${senderID}`,
                        "title": "ORDER BOOK",
                        "webview_height_ratio": "tall",
                        "messenger_extensions": true,
                    },
                ]
            }
        }
    }
    return response;
}

let handleChangeBook = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            //send an image
            let responseTem = getImageChangBookTemplate(sender_psid);
            //send button
            let responseButton = getButtonTemplate(sender_psid);
            await callSendApi(sender_psid, responseTem);
            await callSendApi(sender_psid, responseButton);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

let handleGuideToUseBot = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            //send text
            let username = await getUserName(sender_psid);
            let responseName = { "text": `Xin chào bạn ${username} đến với MilkyWay\n Để biết thêm thông tin vui lòng xem bên dưới 😂` }
            //send media template
            let responseGuide = { "text": 'Bấm vào nút bắt đầu đẻ sử dụng bot \n Tiếp tục bấm vào List Bôk để xem danh mục sách của cửa hàng\nSẽ có hai lựa chọn là Novel và Mâng, click vào từng lựa chọn đẻ xem sách\n Nút VIEW DETAILS giúp bạn xem chi tiết thông tin sách\n Bấm vào nút ORDER BOOK sẽ hiện ra một ưebview đẻ bạn điièn thông tin vào để đặt sách\n Ngoài ra còn có nút GO BACK giúp bạn quay lại lựa chọn trước đố\nBạn có thể xem trang Fanpage và youtube của cửa hàng thông qua các lựa chọn trên Menu Presistants \nBấm Restart this bot nếu bạn muốn khởi động lại bot' }
            let responseTem = getStartedQuickReplyTemplate(sender_psid);
            await callSendApi(sender_psid, responseName);
            await callSendApi(sender_psid, responseGuide);
            await callSendApi(sender_psid, responseTem);
            resolve("done")
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleWithStarted: handleWithStarted,
    handleSendListBook: handleSendListBook,
    handleSendNovel: handleSendNovel,
    handleSendManga: handleSendManga,
    handleDetailNovel: handleDetailNovel,
    handleDetailFantasy: handleDetailFantasy,
    handleDetailSlice: handleDetailSlice,
    handleChangeBook: handleChangeBook,
    callSendApi: callSendApi,
    getUserName: getUserName,
    handleGuideToUseBot: handleGuideToUseBot,
    sendNovelTemplate: sendNovelTemplate,
    sendMangaTemplate: sendMangaTemplate
}