const Event = require("../base/Event");

class Ready extends Event {
  constructor(...args) {
    super(...args, {
      name: "ready"
    });
  }

  async listen(client) {
    console.log(`${client.user.tag} is online!`);
  }
}

module.exports = Ready;
