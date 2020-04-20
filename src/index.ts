import express from 'express'
import * as line from '@line/bot-sdk'
import * as bot from './bot'

const PORT = process.env.PORT || 5000

express()
  .post('/post/', (req, res) => bot.NoticeLine(req, res))
  .post('/hook/', line.middleware(bot.Config), (req, res) => {
    res.status(200).end()
    req.body.events.forEach((e: line.WebhookEvent) => bot.EchoMessage(e))
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
