import express from 'express'
import * as line from '@line/bot-sdk'
import * as env from './env'
import {Option} from './type'

export const Config = {
  channelAccessToken: env.GetVal('ACCESS_TOKEN'),
  channelSecret: env.GetVal('SECRET_KEY'),
}

const client = new line.Client(Config)

export const PostMessage = (req: express.Request, res: express.Response) => {
  client.pushMessage(env.GetVal('MESSAGE_CHANNEL'), {
    type: 'text',
    text: `[bot]\n${req.query.mes}`,
  })
  return res.json({status: 'success'})
}

export const EchoMessage = async (e: line.WebhookEvent) => {
  if (e.type !== 'message' || e.message.type !== 'text') return
  const text = e.message.text
  const replyToken = e.replyToken

  if (replyText(text, replyToken)) return
  if (replyImage(text, replyToken)) return
}

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

const replyImage = (text: string, replyToken: string): boolean => {
  const url: Option<string> = (() => {
    switch (text) {
      case 'ヤバイわよ':
      case 'ヤバイわよ！':
      case 'ヤバイわよ！！':
      case 'ヤバイわよ!':
      case 'ヤバイわよ!!':
        return env.GetVal('YABAIWAYO')
      case 'やばいですね':
      case 'やばいですね☆':
        return env.GetVal('YABAIDESUNE')
      case 'めっちゃやむ':
      case 'めっちゃやむ!':
      case 'めっちゃやむ！':
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