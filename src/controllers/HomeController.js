require('dotenv').config();
import request from "request";
import chatBotService from "../services/chatBotService";
import moment from "moment";
const { GoogleSpreadsheet } = require('google-spreadsheet');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const SPREADSHET_ID = process.env.SPREADSHET_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;

let writeDataToGoogleSheet = async (data) => {
    let currentDate = new Date();
    const format = "HH:mm DD/MM/YYYY"
    let formatedDate = moment(currentDate).format(format);

    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(SPREADSHET_ID);

    // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    await doc.useServiceAccountAuth({
        client_email: JSON.parse(`"${CLIENT_EMAIL}"`),
        private_key: JSON.parse(`"${PRIVATE_KEY}"`),
    });

    await doc.loadInfo(); // loads document properties and worksheets

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    // append rows
    await sheet.addRow(
        {
            "Tên Facebook": data.username,
            "Email": data.email,
            "Số điện thoại": data.phoneNumber,
            "Thời gian": formatedDate,
            "Tên khách hàng": data.customerName,
            "Địa chỉ": data.address,
        });
}
//process.env.NAME_VARIABLES
let getHomePage = (req, res) => {
    return res.render('homepage.ejs');
};

let postWebhook = (req, res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

let getWebhook = (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

// Handles messages events
function handleMessage(sender_psid, received_message) {

    let response;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    switch (payload) {
        case 'yes':
            response = { "text": "Thanks!" }
            break;
        case 'no':
            response = { "text": "Oops, try sending another image." }
            break;
        case 'RESTART_BOT':
        case 'GET_STARTED':
            await chatBotService.handleWithStarted(sender_psid)
            break;
        case 'MAIN_BOOK':
        case 'BACK_TO_LIST_BOOK':
            await chatBotService.handleSendListBook(sender_psid)
            break;
        case 'NOVEL':
            await chatBotService.handleSendNovel(sender_psid)
            break;
        case 'MANGA':
            await chatBotService.handleSendManga(sender_psid)
            break;
        case 'VIEW_NOVEL':
            await chatBotService.handleDetailNovel(sender_psid)
            break;
        case 'VIEW_FANTASY':
            await chatBotService.handleDetailFantasy(sender_psid)
            break;
        case 'VIEW_SLICEOFSLICE':
            await chatBotService.handleDetailSlice(sender_psid)
            break;
        case 'VIEW_DORAEMON':
            await chatBotService.handleDetailDoraemon(sender_psid)
            break;
        case 'VIEW_FAIRYTAIL':
            await chatBotService.handleDetailFairyTail(sender_psid)
            break;
        case 'VIEW_ONEPIECE':
            await chatBotService.handleDetailOnePiece(sender_psid)
            break;
        case 'CHANGE_BOOK':
            await chatBotService.handleChangeBook(sender_psid)
            break;
        default:
            response = { "text": `Oops, i dont know response with postback ${payload}` }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
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

let setupProfile = async (req, res) => {
    let request_body = {
        "get_started": { "payload": "GET_STARTED" },
        "whitelisted_domains": ["https://chatboxmessenger.onrender.com"]
    }

    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v15.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('Setup user succeed!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });

    return res.send("Setup user succeed!")
}

let setupPersistentMenu = async (req, res) => {
    let request_body = {
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "web_url",
                        "title": "Youtube channel Milkyway",
                        "url": "https://www.originalcoastclothing.com/",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "web_url",
                        "title": "Facebook page Milkyway",
                        "url": "https://www.facebook.com/ncntt",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "Restart this bot",
                        "payload": "RESTART_BOT"
                    }
                ]
            }
        ]
    }

    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v15.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('Setup persistent menu succeed!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });

    return res.send("Setup persistent menu succeed!")
}

let orderBook = (req, res) => {
    let senderId = req.params.senderId;
    return res.render('orderBook.ejs', {
        senderId: senderId
    });
}

let handlePostOrderBook = async (req, res) => {
    try {
        //write data to googlesheet
        let data = {
            username: await chatBotService.getUserName(req.body.psid),
            email: req.body.email,
            phoneNumber: `'${req.body.phoneNumber}`,
            customerName: req.body.customerName,
            address: req.body.address,
        }
        await writeDataToGoogleSheet(data);

        let customerName = "";
        if (req.body.customerName === "") {
            customerName = await chatBotService.getUserName(req.body.psid)
        } else customerName = req.body.customerName

        let response = {
            "text": `----Thông tin khách hàng------
             \nHọ và tên :${customerName}
             \nEmail: ${req.body.email}
             \nSố điện thoại :${req.body.phoneNumber}
             \nĐịa chỉ :${req.body.address}
             `
        };

        await chatBotService.callSendApi(req.body.psid, response);
        return res.status(200).json({
            message: 'OK'
        })
    } catch (e) {
        console.log("Error order book", e);
        return res.status(500).json({
            message: 'Error order book'
        })
    }
}

module.exports = {
    getHomePage: getHomePage,
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    setupPersistentMenu: setupPersistentMenu,
    orderBook: orderBook,
    handlePostOrderBook: handlePostOrderBook
}