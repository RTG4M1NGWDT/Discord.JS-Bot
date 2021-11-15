const { 
  Client,
  Collection,
  Intents
  } = require('discord.js');
const {
  readdirSync
  } = require('fs');

class ClientManager extends Client {
  constructor(options = {}) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
      ]
    });

    this.commands = new Collection();
    this.aliases = new Collection();
    this.config = process.env;
  }

  async build() {
    this.login(this.config.TOKEN);
    this.eventHandler();
    this.commandHandler();
  }
  
  async eventHandler() {
    const folder = readdirSync("./Events");

    for(const file of folder) {
      const event = new (require(`../Events/${file}`));
      this.on(event.name, event.listen.bind(null, this));
      console.log(event)
    }
  }

  async commandHandler() {
    const folders = readdirSync("./Commands");

    for(const folder of folders) {
      const files = readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js'));

      for(const file of files) {
        const command = new (require(`../Commands/${folder}/${file}`));
        this.commands.set(command.name, command);

        for(const alias of command.aliases) {
          this.aliases.set(alias, command);
        }
      }
    }
  }
}

module.exports = ClientManager;
