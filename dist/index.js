"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var line = __importStar(require("@line/bot-sdk"));
var bot = __importStar(require("./bot"));
var PORT = process.env.PORT || 5000;
express_1["default"]()
    .post('/post/', function (req, res) { return bot.NoticeLine(req, res); })
    .post('/hook/', line.middleware(bot.Config), function (req, res) {
    res.status(200).end();
    req.body.events.forEach(function (e) { return bot.EchoMessage(e); });
})
    .listen(PORT, function () { return console.log("Listening on " + PORT); });
