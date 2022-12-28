import express from "express";
import homeController from "../controllers/HomeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);

    //setup get started button, whitelisted domain
    router.post("/setup-profile", homeController.setupProfile);

    //setup persistent menu
    router.post("/setup-persistent-menu", homeController.setupPersistentMenu);

    router.post('/webhook', homeController.postWebhook);
    router.get('/webhook', homeController.getWebhook)
    return app.use('/', router);
}

module.exports = initWebRoutes;
