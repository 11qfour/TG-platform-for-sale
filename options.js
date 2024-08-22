module.exports = {
    customerMenu:{
        reply_markup: JSON.stringify({
            inline_keyboard:[
                [{text: 'Сделать заказ', callback_data: 'newOrder'},{text:'Мои заказы', callback_data:'custOrder'}],
                [{text:'Найти товары🔎', url: 'https://t.me/handbrandshop'},{text:'Помощь💊', url: 'https://t.me/fourteenroutine'}],
            ]
        })
    },
    sellerMenu:{
        reply_markup: JSON.stringify({
            inline_keyboard:[
                [{text: 'Выложить объявление', callback_data: 'newSell'},{text:'Мои объявления', callback_data:'sellOrder'}],
                [{text:'Найти товары🔎', url: 'https://t.me/handbrandshop' },{text:'Помощь💊', url: 'https://t.me/fourteenroutine'}] //поменять url ТП
            ]
        })
    },
    mainMenu:{
        reply_markup: JSON.stringify({
            inline_keyboard:[
                [{text: 'Продавец', callback_data: 'sellerData'}, {text:'Покупатель', callback_data:'customerData'}],
            ]
        })
    },
    orderMenu:{
        reply_markup: JSON.stringify({
            inline_keyboard:[
                [{text: 'В чат', callback_data: 'chat'}, {text:'К заказу', callback_data:'toOrder'}, {text: 'Отказ',callback_data: 'cancelO'}],
            ]
        })
    }
}