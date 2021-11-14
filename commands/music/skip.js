const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    StreamType,
    AudioPlayerStatus
} = require('@discordjs/voice');
const {
  skip
} = require('../../Utility.js');

module.exports = {
    aliases: [],
    async execute(client, message, args) {
      const queue = client.queue.get(message.guild.id);
      skip(queue);
    }
}
