const { sendEmbed } = require('../Utility.cjs');

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type == "dm") return;

  const prefix = '!';

  const messageArray = message.content.split(" ");
  const cmd = messageArray[0];
  const args = message.content
    .slice(prefix.length)
    .split(/ +/)
    .slice(1);

  if (!message.content.startsWith(prefix)) return;
  const commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));

  if (commandfile) {
    if(message.member.permissions.has(commandfile.permissions) || commandfile.permissions === []) {
      commandfile.execute(client, message, args);
    } else {
      return sendEmbed(message.channel, "Invalid Permissions", "RED", "You do not have permission to use this command.", null, `Permissions needed: [${commandfile.permissions.join(", ")}]`);
    }
  }
}
