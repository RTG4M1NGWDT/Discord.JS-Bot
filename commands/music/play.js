const { sendEmbed } = require('../../Utility');

module.exports = {
  aliases: [],
  permissions: [],
  async execute(client, message, args) {
    sendEmbed(message.channel, "In development", "RED");
  }
}
