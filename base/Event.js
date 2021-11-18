module.exports = class Event {
  constructor(options = {}) {
    this.name = options.name;
  }

  // eslint-disable-next-line no-unused-vars
  async listen(...args) {
    throw new Error(
      `The listen method has not been implemented in ${this.name}`
    );
  }

  getName() {
    return this.name;
  }
};
