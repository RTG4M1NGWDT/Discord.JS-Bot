const Event = require("../base/Event");

class Message extends Event {
  constructor(...args) {
    super(...args, {
      name: "messageCreate"
    });
  }

  listen(client, message) {
    const prefix = client.config.PREFIX;
    if (message.author.bot || message.channel.type == "dm") return;

    const messageArray = message.content.split(" ");
    const cmd = messageArray[0];
    const args = message.content
      .slice(prefix.length)
      .split(/ +/)
      .slice(1);

    if (!message.content.startsWith(prefix)) return;

    const command =
      client.commands.get(cmd.slice(prefix.length)) ||
      client.aliases.get(cmd.slice(prefix.length));

    if (args.length < command.getMinArgs()) {
      return message.channel.send(command.getUsage());
    }  
    
    if(command.getMaxArgs === null) {
      
    } else if(args.length > command.getMaxArgs()) {
      return message.channel.send(command.getUsage());
    }

    if (command) {
      command.execute(client, message, args);
    }
  }
}

module.exports = Message;
