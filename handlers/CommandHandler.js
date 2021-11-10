const { readdirSync } = require('fs');

module.exports = (client) => {
  const commandFolder = readdirSync("commands");
  for(const folder of commandFolder) {
    const commandFiles = readdirSync(`commands/${folder}`).filter(file => file.endsWith(".js"));
    for(const file of commandFiles) {
      const command = require(`../commands/${folder}/${file}`);
      const commandName = file.split(".")[0];
      client.commands.set(commandName, command)
      client.aliases.set(command.aliases, commandName);
    }
  }
}
