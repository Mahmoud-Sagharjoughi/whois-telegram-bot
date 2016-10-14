#!/bin/nodejs

var TelegramBot = require('node-telegram-bot-api'),
    whois = require('whois-api'),
	toDate = require('normalize-date'),
    config = require('./config');
    bot = new TelegramBot(config.bot.key, {
        polling: config.bot.polling
    });

var monthDic = {
	Jan: "1",
	Feb: "2",
	Mar: "3",
	Apr: "4",
	May: "5",
	Jun: "6",
	Jul: "7",
	Aug: "8",
	Sep: "9",
	Oct: "10",
	Nov: "11",
	Dec: "12"
};

var COM = false;
var actW = false;


bot.on('message', (message) => {
    var chat_id = message.chat.id;
	if (message.text == '/start' && actW == false && COM == false) {
        bot.sendMessage(message.chat.id,'Welcome');
		var options = {
		    reply_markup: JSON.stringify({
			    inline_keyboard: [
				    [{ text: 'Whois EXP', callback_data: '1'}]
				]
			})
		};
		bot.sendMessage(message.chat.id,'What do you want !?!?!?',options);
		COM = true;
		bot.on('callback_query', function onCallbackQuery(callbackQuery) {
		        let action = callbackQuery.data;
				if (action == "1") {
				    bot.answerCallbackQuery(callbackQuery.id,'Please Enter The Site\'s domain',{
					    show_alert: false
					});
					actW = true;
					COM = true;
				}									
			});
	} else if (message.text != '/whois' && actW == false && COM == false) {
				bot.sendMessage(chat_id,'For now I can\'t Understand Please Enter /whois');	
	} else if (message.text == '/whois' && actW == false && COM == false) {
				var options = {
					reply_markup: JSON.stringify({
						inline_keyboard: [
							[{ text: 'Whois EXP', callback_data: '1'}]
						]
					})
				};
				bot.sendMessage(message.chat.id,'What do you want !?!?!?',options);
				COM = true;
				bot.on('callback_query', function onCallbackQuery(callbackQuery) {
					let action = callbackQuery.data;
					if (action == "1") {
						bot.answerCallbackQuery(callbackQuery.id,'Please Enter The Site\'s domain',{
							show_alert: true
						});
						actW = true;
						COM = true;
					}									
				});
	} else if (message.entities != undefined && message.entities[0].type == 'url' && actW == true) {
				whois.lookup(message.text, (error, result) => {
					if (result.expiration_date == undefined) {
						bot.sendMessage(message.chat.id,'It seems it doesn\'t have EXPIRE-DATE :|', {
						reply_to_message_id: message.message_id
					});
					} else {
						var ToDate = String(toDate((message.date) + '.000'));
						var newDay = ToDate.substr(8,2);
						var newMonth = ToDate.substr(4,3);
						var newYear = ToDate.substr(11,4);
						var new_Date = new Date(result.expiration_date);
						var resultDay = new_Date.getDate();
						var resultMonth = Number(new_Date.getMonth())+1;
						var resultYear = new_Date.getFullYear();
						var date1 = new Date(`${monthDic[newMonth]}/${newDay}/${newYear}`);
						var date2 = new Date(`${resultMonth}/${resultDay}/${resultYear}`);
						var timeDiff = Math.abs(date2.getTime() - date1.getTime());
						var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
						var text = `Site Name: ${message.text}\nExpiration Date: ${result.expiration_date}\n${diffDays} Days to expiration date`;
						bot.sendMessage(chat_id,text, {
							reply_to_message_id: message.message_id
						});
					}
				});
			    actW = false;
			    COM = false;
	} else if (COM == true && actW == true) {
				bot.sendMessage(chat_id,'Please Enter The Site\'s domain');	
	} else if (message.text != '/whois' && actW == false && COM == true) {
				bot.sendMessage(chat_id,'Please select a button');	
	}
});