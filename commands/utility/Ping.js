const Command = require("../../base/Command");
const { MessageEmbed } = require("discord.js");

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      name: "ping",
      aliases: [],
      description: "Ask it a question -_-",
      usage: "!ping",
      category: "Utility"
    });
  }

  execute(client, message, args) {
    const embed = new MessageEmbed()
      .setTitle("Bot Ping")
      .setColor("BLUE")
      .setDescription(`${client.ws.ping}ms`);
    message.channel.send({ embeds: [embed] });
  }
}

module.exports = Ping;
