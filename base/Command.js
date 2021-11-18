class Command {
  constructor(options = {}) {
    this.name = options.name;
    this.permission = options.permission;
    this.description = options.description;
    this.usage = options.usage;
    this.aliases = options.aliases;
    this.minArgs = options.minArgs;
    this.maxArgs = options.maxArgs;
  }

  async execute(client, message, args) {
    throw new Error(`Could not find execute method in command ${this.name}`);
  }

  getName() {
    return this.name;
  }

  getPermission() {
    return this.permission;
  }

  setPermission(permission) {
    this.permissions.push(permission);
  }

  unsetPermission() {
    this.permissions.pop();
  }

  getPermissionMessage() {
    return this.permissionMessage;
  }

  getDescription() {
    return this.description;
  }

  getUsage() {
    return this.usage;
  }

  setAliases(alias) {
    this.aliases.push(alias);
  }

  unsetAliases() {
    this.aliases.pop();
  }

  getAliases() {
    return this.aliases || [];
  }

  setDescription(description) {
    this.description = description;
  }

  setPermissionMessage(permissionMessage) {
    this.permissionMessage = permissionMessage;
  }

  setUsage(usage) {
    this.usage = usage;
  }

  getDescription() {
    return this.description || "No description provided";
  }

  getUsage() {
    return this.usage || "No usage provided";
  }

  getMinArgs() {
    return this.minArgs || 0;
  }

  getMaxArgs() {
    return this.maxArgs || null;
  }
}

module.exports = Command;
