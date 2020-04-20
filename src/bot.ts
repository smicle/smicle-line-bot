import express from 'express'
import * as line from '@line/bot-sdk'
import * as env from './env'
import {Option} from './type'

/**
 * Lineのconfig
 * @property channelAccessToken: string - アクセストークン
 * @property channelSecret: string - シークレットキー
 */
export const Config = {
  channelAccessToken: env.GetVal('ACCESS_TOKEN'),
  channelSecret: env.GetVal('SECRET_KEY'),
}

const client = new line.Client(Config)

/**
 * バイトの通知をする機能。
 * GoogleAppsScriptからPOSTされる
 * @param req GoogleAppsScriptからのリクエスト
 * @param res GoogleAppsScriptからのレスポンス
 */
export const NoticeLine = (req: express.Request, res: express.Response) => {
  client.pushMessage(env.GetVal('MESSAGE_CHANNEL'), {
    type: 'text',
    text: `[bot]\n${req.query.mes}`,
  })
  return res.json({status: 'success'})
}

/**
 * 入力されたメッセージに応じて返信する
 * @param e Lineのメッセージイベント
 */
export const EchoMessage = async (e: line.WebhookEvent) => {
  if (e.type !== 'message' || e.message.type !== 'text') return
  const text = e.message.text
  const replyToken = e.replyToken

  if (replyText(text, replyToken)) return
  if (replyImage(text, replyToken)) return
}

/**
 * 特定のメッセージの場合、返信をする
 * @param text メッセージの内容
 * @param replyToken メッセージがきたチャンネルのToken
 */
const replyText = (text: string, replyToken: string): boolean => {
  if (text === 'スプレッドシート') {
    client.replyMessage(replyToken, {
      type: 'text',
      text: env.GetVal('SPREAD_SHEETS'),
    })
    return true
  }

  return false
}

/**
 * 特定のメッセージの場合、画像を返す
 * @param text メッセージの内容
 * @param replyToken メッセージがきたチャンネルのToken
 */
const replyImage = (text: string, replyToken: string): boolean => {
  const url: Option<string> = (() => {
    const t = text.replace(/!|！|☆/g, '').replace('ヤバい', 'ヤバイ')
    switch (t) {
      case 'ヤバイわよ':
        return env.GetVal('YABAIWAYO')
      case 'やばいですね':
        return env.GetVal('YABAIDESUNE')
      case 'めっちゃやむ':
        return env.GetVal('METTYAYAMU')
    }
  })()

  if (!url) return false

  client.replyMessage(replyToken, {
    type: 'image',
    originalContentUrl: url,
    previewImageUrl: url,
  })
  return true
}
