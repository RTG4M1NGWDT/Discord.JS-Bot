const ytpl = require('ytpl');
const { sendEmbed, playSong } = require('../../Utility.js');

module.exports = {
    aliases: [],
    async execute(client, message, args) {
      const voice_channel = message.member.voice.channel;
      
      if (!voice_channel) {
        return sendEmbed(message.channel, "ERROR", "RED", "Please join a voice channel first!");
      }
      
      const search = await ytpl(args.join(" "));
      
      for(const result of search.items) {
        playSong(message.guild, result, client)
      }
    }
}
