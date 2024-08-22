require('dotenv').config();
const {Bot, GrammyError, Keyboard, InlineKeyboard} = require('grammy');
const Token = process.env.TOKEN;
const {customerMenu, sellerMenu, mainMenu, orderMenu} = require('./options');
const bot = new Bot(Token)

let numOrder = '000000'; //менять по номеру заказа для продавца

bot.api.setMyCommands([
    {command: '/start',description: 'Заказ'},
    {command: '/help', description: 'Тех. поддержка'},
    /*{command: '/admins', description: 'Для админов'}*/
])

const _helpContact = async ctx => {
    await ctx.reply(`[Контакт тех\\. поддержки](https://t.me/fourteenroutine)`,{
        parse_mode: "MarkdownV2", 
        disable_web_page_preview: true
    })
}

const _answerToSeller = async ctx => {
    await ctx.reply(`У вас новый покупатель по заказу ${numOrder}`, orderMenu)
}

bot.callbackQuery('chat', async ctx => {
    try{
        await ctx.reply('Привет, что вы хотите сделать?', sellerMenu);
        ctx.answerCallbackQuery('');
    }
    catch(e){
        console.error(`Ошибка в блоке перехода от продавца к заказчику: ${e}`);
        await ctx.reply(`Ошибка в блоке перехода от продавца к заказчику: ${e}`);
    }
})


bot.command('start', async ctx => {
    try{
        await ctx.reply('Кем вы являетесь на платформе?', mainMenu);
    }
    catch(e){
        console.error(`Ошибка в выборе заказа: ${e}`);
        await ctx.reply(`Ошибка в выборе заказа: ${e}`);
    }
})

bot.callbackQuery(/seller./, async ctx => {
    try{
        await ctx.reply('Привет, что вы хотите сделать?', sellerMenu);
        ctx.answerCallbackQuery('');
    }
    catch(e){
        console.error(`Ошибка в блоке продавца: ${e}`);
        await ctx.reply(`Ошибка в блоке продавца: ${e}`);
    }
})

bot.callbackQuery(/customer./, async ctx => {
    try{
        await ctx.reply('Привет, что вы хотите сделать?', customerMenu);
        ctx.answerCallbackQuery('');
    }
    catch(e){
        console.error(`Ошибка в блоке покупателя: ${e}`);
        await ctx.reply(`Ошибка в блоке покупателя: ${e}`);
    }
})

bot.callbackQuery('newOrder', async ctx => {
    ctx.answerCallbackQuery('');
    await ctx.reply('Введите инвентарный (шестизначный) номер товара');
})

bot.hears(/^[0-9]{6}$/, async ctx => { //только 6 значное число
    try{
        await ctx.reply('Ваш заказ отправлен продавцу. Через некоторое время он с вами свяжется. Могу ли я вам ещё чем-то помочь?', customerMenu);
        /*работа с БД Сделки -> найти по первичному ключу заказчика и отправить ему сообщение от бота о новом заказе от пользователя по ссылке*/
    }
    catch (e){
        console.log(`Ошибка в блоке оформления заказа  ${e}`);
        await ctx.reply(`Ошибка в блоке оформления заказа  ${e}`);
    }
})

bot.callbackQuery('newSell', async ctx => {
    ctx.answerCallbackQuery('');
    await ctx.reply('Прикрепите медиафайлы товара (до 4-х штук) с описанием по образцу:');
    await ctx.reply('Образец'); //начать с Новое объявление
})

bot.hears(/Новое объявление:/, async ctx => {
    try{
        await ctx.reply('Вашe объявление успешно отправлено модераторам. В ближайшее время оно будет выложено в магазин, могу ли я вам ещё чем-то помочь?', sellerMenu);
        /*работа с БД Сделки -> первичный ключ присваивается следующий автоматически и отправляется сообщение тех.подд. для модерации*/
    }
    catch (e){
        console.log(`Ошибка в блоке отправления объявления  ${e}`);
        await ctx.reply(`Ошибка в блоке отправления объявления  ${e}`);
    }
})

bot.callbackQuery('custOrder', async ctx => {
    ctx.answerCallbackQuery('');
    await ctx.reply('Ваши заказы:\n');
    /*Вывести массив заказов покупателя из БД Сделки со статусами*/
})

bot.callbackQuery('sellOrder', async ctx=>{
    ctx.answerCallbackQuery('');
    await ctx.reply('Ваши объявления:\n');
    /*Вывести массив заказов покупателя из БД Сделки со статусами*/
})

bot.command('help',async ctx => {
    try{
        //_helpContact(ctx);
        const keyb= new InlineKeyboard().url('Техническая поддержка','https://t.me/fourteenroutine');
        await ctx.reply('Мы ждем ваши вопросы и предложения👇', {
            reply_markup: keyb
        })
    }
    catch(e){
        console.error(`Ошибка в передаче сообщения в тех. поддержку: ${e}`);
        await ctx.reply(`Ошибка в передаче сообщения в тех. поддержку: ${e}`);
    }
})

bot.catch((err)=> {
    const ctx = err.ctx;
    console.error(`error while handling update ${ctx.update.update_id}`);
    const e = err.error;

    if (e instanceof GrammyError){
        console.error("Ошибка в запросе", e.description);
    }
    else if (e instanceof HttpError) //troubles with tg connection
    {
        console.error("Проблемы с подключением к телеграмму: ", e);
    }
})

bot.start();