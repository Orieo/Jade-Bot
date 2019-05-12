const {RichEmbed} = require('discord.js');

module.exports = async (bot, message, active) => {

    let data = active.get(message.guild.id) || {};

    const embed = new RichEmbed().setTitle('Queue:').setColor('#30b3c1');
    let description = '';
    for(let i = 0; i < data.queue.length; i++) {
        description += `${i + 1}. ${data.queue[i].songTitle}\n`;
    }

    embed.setDescription(description);
    message.channel.send(embed);
}
