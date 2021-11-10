const { readdirSync } = require('fs');

module.exports = (client) => {
  const eventFiles = readdirSync("events");
  for (const file of eventFiles) {
    const event = require(`../events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  }
}
