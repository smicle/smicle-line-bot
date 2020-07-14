import * as line from '@line/bot-sdk'
import express from 'express'
import throwEnv from 'throw-env'
import Settings from 'const-settings'
import Option from 'type-of-option'

/**
 * LINEのconfig
 * @property channelAccessToken: string - アクセストークン
 * @property channelSecret: string - シークレットキー
 */
export const Config = {
  channelAccessToken: throwEnv('ACCESS_TOKEN'),
  channelSecret: throwEnv('SECRET_KEY'),
}

const client = new line.Client(Config)

/**
 * バイトの通知をする機能。
 * GoogleAppsScriptからPOSTされる
 * @param req GoogleAppsScriptからのリクエスト
 * @param res GoogleAppsScriptからのレスポンス
 */
export const NoticeLine = (req: express.Request, res: express.Response) => {
  client.pushMessage(throwEnv('MESSAGE_CHANNEL'), {
    type: 'text',
    text: `[bot]\n${req.query.mes}`,
  })
  return res.json({status: 'success'})
}

/**
 * 入力されたメッセージに応じて返信する
 * @param e LINEのメッセージイベント
 */
export const EchoMessage = async (e: line.WebhookEvent) => {
  if (e.type !== 'message' || e.message.type !== 'text') return
  const text = e.message.text
  const replyToken = e.replyToken

  if (replyText(text, replyToken)) return
  if (replyImage(text, replyToken)) return
}

/**
 * 処理が成功したか失敗したかの結果を返す
 */
type Result = boolean

/**
 * 特定のメッセージの場合、返信をする
 * @param text メッセージの内容
 * @param replyToken メッセージがきたチャンネルのToken
 */
const replyText = (text: string, replyToken: string): Result => {
  if (text === 'スプレッドシート') {
    client.replyMessage(replyToken, {
      type: 'text',
      text: Settings.SPREAD_SHEETS,
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
const replyImage = (text: string, replyToken: string): Result => {
  // prettier-ignore
  const url: Option<string> =
    text.match(/やばいですね/) ? Settings.URL.YABAIDESUNE :
    text.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/) ? Settings.URL.YABAIWAYO :
    text.match(/やむ/) ? Settings.URL.METTYAYAMU :
    null

  if (!url) return false

  client.replyMessage(replyToken, {
    type: 'image',
    originalContentUrl: url,
    previewImageUrl: url,
  })
  return true
}
