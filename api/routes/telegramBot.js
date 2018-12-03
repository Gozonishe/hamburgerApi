const express = require ('express');
const router = express.Router();

const TelegramBot = require('node-telegram-bot-api');
const token = '777581606:AAEsnpAVzZhpjynxiN5_u7QN-vkLZfJo8IQ';
const bot = new TelegramBot(token, {polling: true});
const chatId = '119877353'

router.get('/', (req, res, next) => {  
    bot.sendMessage(chatId, 'Проверочка. Триггер на Get')
    return res.send('Проверочка. Триггер на Get')
})

router.post('/', (req, res, next) => {  
    const body = req.body;
    if (!body.text){
        return res.send('text property is required')
    }
    bot.sendMessage(chatId, body.text)
    return res.send(body.text)
})

module.exports = router;