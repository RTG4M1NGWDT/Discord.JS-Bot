class Command {
  constructor(options = {}) {
    this.name = options.name;
    this.aliases = options.aliases || [];
    this.description = options.description || "No description provided";
    this.usage = options.usage || "No usage provided";
  }

  async execute(client, message, args) {
    throw new Error(`Could not find execute method in command ${this.name}`);
  }

  async getName() {
    return this.name;
  }
}

module.exports = Command;
