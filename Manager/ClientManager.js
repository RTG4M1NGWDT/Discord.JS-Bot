const { 
  Client,
  Collection,
  Intents
  } = require('discord.js');
const {
  readdirSync
  } = require('fs');

module.exports = class ClientManager extends Client {
  constructor(options = {}) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
      ]
    });

    this.commands = new Collection();
    this.config = process.env;
  }

  async build() {
    this.login(this.config.TOKEN);
    this.eventHandler();
  }
  
  async eventHandler() {
    const folder = readdirSync("./Events");

    for(const file of folder) {
      const event = require(`../Events/${file}`);
      const eventName = event.name;
      
      this.on(eventName, event.listen.bind(null, client));
    }
  }
}
