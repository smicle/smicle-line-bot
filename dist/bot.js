"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var line = __importStar(require("@line/bot-sdk"));
var throw_env_1 = __importDefault(require("throw-env"));
exports.Config = {
    channelAccessToken: throw_env_1["default"]('ACCESS_TOKEN'),
    channelSecret: throw_env_1["default"]('SECRET_KEY')
};
var client = new line.Client(exports.Config);
exports.NoticeLine = function (req, res) {
    client.pushMessage(throw_env_1["default"]('MESSAGE_CHANNEL'), {
        type: 'text',
        text: "[bot]\n" + req.query.mes
    });
    return res.json({ status: 'success' });
};
exports.EchoMessage = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var text, replyToken;
    return __generator(this, function (_a) {
        if (e.type !== 'message' || e.message.type !== 'text')
            return [2];
        text = e.message.text;
        replyToken = e.replyToken;
        if (replyText(text, replyToken))
            return [2];
        if (replyImage(text, replyToken))
            return [2];
        return [2];
    });
}); };
var replyText = function (text, replyToken) {
    if (text === 'スプレッドシート') {
        client.replyMessage(replyToken, {
            type: 'text',
            text: throw_env_1["default"]('SPREAD_SHEETS')
        });
        return true;
    }
    return false;
};
var replyImage = function (text, replyToken) {
    var url = (function () {
        var t = text.replace(/!|！|☆/g, '').replace('ヤバい', 'ヤバイ');
        switch (t) {
            case 'ヤバイわよ':
                return throw_env_1["default"]('YABAIWAYO');
            case 'やばいですね':
                return throw_env_1["default"]('YABAIDESUNE');
            case 'めっちゃやむ':
                return throw_env_1["default"]('METTYAYAMU');
        }
    })();
    if (!url)
        return false;
    client.replyMessage(replyToken, {
        type: 'image',
        originalContentUrl: url,
        previewImageUrl: url
    });
    return true;
};
