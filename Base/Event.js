module.exports = class Event {

	constructor(options = {}) {
		this.name = options.name;
		this.client = options.client;
		this.type = options.once ? 'once' : 'on';
		this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
	}

	// eslint-disable-next-line no-unused-vars
	async listen(...args) {
		throw new Error(`The run method has not been implemented in ${this.name}`);
	}
};
