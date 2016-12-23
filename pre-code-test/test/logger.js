import {Logger} from '../logger';
import chai from 'chai';
import sinon from 'sinon';

let expect = chai.expect;

describe('Logger', () => {

	describe('constructor', () => {

		it('should not throw an exception if the new keyword is omitted.', () => {
			expect(Logger()).to.not.throw;
		});

		it('should should still return an instance if the new keyword is omitted.', () => {
			let logger = Logger();
			expect(logger instanceof Logger).to.be.true;
		});

		it('if a "format" function is provided, should overwrite the prototype "format" method with the provided.', () => {
			let format = () => 'hello';
			let logger = new Logger({format});

			expect(logger.format).to.equal(format);
		});

		it('if a "transport" function is provided, should overwrite the prototype "transport" method with the provided.', () => {
			let transport = () => 'hello';
			let logger = new Logger({transport});

			expect(logger.transport).to.equal(transport);
		});

		it('if a "root" parameter is provided, should set the "root" property on the instance to parameter provided.', () => {
			let logger = new Logger({root: 'hello-root'});

			expect(logger.root).to.equal('hello-root');
		});

		it('if a "root" parameter is not provided, should set the "root" property on the instance to "root".', () => {
			let logger = new Logger({});

			expect(logger.root).to.equal('root');
		});

	});

	describe('Logger.prototype.log', () => {

		it('should set instance properties .level and .data.', () => {
			let logger = new Logger({transport: f => f});

			logger.log('hello', 'info');

			expect(logger.level).to.equal('info');
			expect(logger.data).to.equal('hello');
		});

		it('should invoke createLogObject on the instance.', () => {
			let logger = new Logger({transport: f => f});
			let spy = sinon.spy(logger, 'createLogObject');

			logger.log('hello', 'info');

			expect(spy.called).to.be.true;
		});

		it('should invoke format with the result of createLogObject.', () => {
			let logger = new Logger({transport: f => f});
			let stub = sinon.stub(logger, 'createLogObject', () => 'foo');
			let spy = sinon.spy(logger, 'format');

			logger.log('hello', 'info');

			expect(spy.calledWith('foo')).to.be.true;
		});

		it('should invoke transport with the level and the result of this.format.', () => {
			let logger = new Logger({transport: f => f});

			let stub2 = sinon.stub(logger, 'format', () => 'bar');
			let spy = sinon.spy(logger, 'transport');

			logger.log('hello', 'info');

			expect(spy.calledWith('info', 'bar')).to.be.true;
		});
	});

	describe('Logger.prototype.createLogObject', () => {

		it('should return a Plain Object with properties root and level.', () => {
			let logger = new Logger({root: 'foo', level: 'info', transport: f=>f});

			let {root, level} = logger.createLogObject();

			expect(root).to.equal('foo');
			expect(level).to.equal('info');
		});

		it('if the value for the data proptery on the Logger instance is a "string", then the returned object should have a message property with the value set from the data property.', () => {
			let logger = {
				root: 'root',
				data: 'foo'
			};

			let {message} = Logger.prototype.createLogObject.call(logger);

			expect(message).to.equal('foo');
		});

		it('if the value for the data property on the Logger instance is an "object" then the properties from that object should be on the returned.', () => {
			let logger = {
				root: 'root',
				data: {
					foo: 'foo',
					bar: 'bar'
				}
			};

			let {foo, bar} = Logger.prototype.createLogObject.call(logger);

			expect(foo).to.equal('foo');
			expect(bar).to.equal('bar');
		});

		it('the root property on the object returned should be the value of the instance\'s root property', () => {
			let logger = {
				root: 'doodle'
			};

			let {root} = Logger.prototype.createLogObject.call(logger);

			expect(root).to.equal('doodle');
		});

		it('if the instance has a value for the level property, the value of the level property on the returend, should match the instance\'s level proptery.', () => {
			let logger = {
				root: 'root',
				level: 'error'
			};

			let {level} = Logger.prototype.createLogObject.call(logger);

			expect(level).to.equal('error');
		});

		it('if the instance DOES NOT have a value for the level property, the value of the level property on the returend should be "info".', () => {
			let logger = {
				root: 'root'
			};

			let {level} = Logger.prototype.createLogObject.call(logger);

			expect(level).to.equal('info');
		});
	});

	describe('Logger.prototype.format', () => {

		it('should return a JSON formatted string given an Plain Object.', () => {
			let json = {foo: 'bar'};
			let expected = '{"foo":"bar"}';
			let actual = Logger.prototype.format.call(undefined, json);

			expect(expected).to.equal(actual);
		});

	});

	describe('Logger.prototype.transport', () => {
		let spy;

		beforeEach(() => {
			spy = sinon.spy(console, 'log');
		});

		afterEach(() => {
			// unwrap the spy.
			spy.restore();
		});

		it('if the instance level property is set to "error" the color of the text logged should be red.', () => {
			Logger.prototype.transport.call(undefined, 'error', 'hello');
			expect(spy.calledWith('\u001b[31mhello\u001b[39m')).to.be.true;
		});

		it('if the instance level property is set to "warning" the color of the text logged should be yellow.', () => {

			Logger.prototype.transport.call(undefined, 'warning', 'hello');
			expect(spy.calledWith('\u001b[33mhello\u001b[39m')).to.be.true;
		});

		it('if the instance level property is set to "debug" the color of the text logged should be blue.', () => {

			Logger.prototype.transport.call(undefined, 'debug', 'hello');
			expect(spy.calledWith('\u001b[34mhello\u001b[39m')).to.be.true;
		});

		it('if the instance level property is anything but, the color of the text logged should be green.', () => {

			Logger.prototype.transport.call(undefined, 'info', 'hello');
			expect(spy.calledWith('\u001b[32mhello\u001b[39m')).to.be.true;
		});

	});
});
