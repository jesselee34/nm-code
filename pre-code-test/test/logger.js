import {logger as Logger} from '../logger';
import chai from 'chai';
import spies from 'chai-spies';

chai.use(spies);

let expect = chai.expect;

describe('Logger', () => {

	describe('constructor', () => {

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
			let level = 'foo';
			let data = 'bar';
			let logger = new Logger({level, data, transport: f => f});

			logger.log('hello', 'info');

			expect(logger.level).to.equal(level);
			expect(logger.data).to.equal(data);
		});

		it('should invoke createLogObject on the instance.', () => {
			let logger = new Logger({transport: f => f});
			let spy = chai.spy.on(logger, 'createLogObject');

			logger.log('hello', 'info');

			expect(spy).to.have.been.called();
		});

		it('should invoke format with the result of createLogObject.', () => {
			let logger = new Logger({transport: f => f});
			let createLogSpy = chai.spy.on(logger, 'createLogObject').returns('foo');
			let spy = chai.spy.on(logger, 'format');

			logger.log('hello', 'info');

			expect(spy).to.have.been.called.with('foo');
		});

		it('should invoke transport with the results of the afore.', () => {
			let logger = new Logger({transport: f => f});
			let createLogSpy = chai.spy.on(logger, 'createLogObject').returns('foo');
			let formatSpy = chai.spy.on(logger, 'format');
			let spy = chai.spy.on(logger, 'transport');

			logger.log('hello', 'info');

			expect(spy).to.have.been.called.with(['foo', 'bar']);
		});
	});

	describe('Logger.prototype.createLogObject', () => {

		it('should return a Plain Object with properties root and level.', () => {

		});

		it('if the value for the data proptery on the Logger instance is a "string", then the returned object should have a message property with the value set from the data property.', () => {

		});

		it('if the value for the data property on the Logger instance is an "object" then the properties from that object should be on the returned.', () => {

		});

		it('the root property on the object returned should be the value of the instance\'s root property', () => {

		});

		it('if the instance has a value for the level property, the value of the level property on the returend, should match the instance\'s level proptery.', () => {

		});

		it('if the instance DOES NOT have a value for the level property, the value of the level property on the returend should be "info".', () => {

		});
	});

	describe('Logger.prototype.format', () => {

		it('should return a JavaScript object given a JSON formated string.', () => {

		});

	});

	describe('Logger.prototype.transport', () => {

		it('if the instance level property is set to "error" the color of the text logged should be red.', () => {

		});

		it('if the instance level property is set to "warning" the color of the text logged should be yellow.', () => {

		});

		it('if the instance level property is set to "debug" the color of the text logged should be blue.', () => {

		});

		it('if the instance level property is anything but, the color of the text logged should be green.', () => {

		});

	});
});
