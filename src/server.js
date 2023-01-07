import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./configs/viewEngine";
import webRoutes from "./routes/web";
import chatBotService from "./services/chatBotService"
var cors = require('cors')
var app = express()

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config view Engine
viewEngine(app);

//config web routes
webRoutes(app);

let port = process.env.PORT || 8080;
chatBotService.sendNovelTemplate();
app.listen(port, () => {
    console.log("App is running at the port: " + port);
})
