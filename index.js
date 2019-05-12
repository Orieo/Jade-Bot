//Require Packages
const fs = require('fs');
const Discord = require('discord.js');
var auth = require('./auth.json');
// Configure logger settings
// Initialize Discord Bot
const bot = new Discord.Client();
const active = new Map();

fs.readdir('./events/', (err, files) => {
    files.forEach(file => {
        const eventHandler = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        bot.on(eventName, arg => eventHandler(bot, arg, active));
    });
});

bot.login(auth.token);





