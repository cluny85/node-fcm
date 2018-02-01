const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const { events } = require('./index');
const listeners  = require('./listeners');

const { log } = console;

describe('[Unit] events listeners test', () => {
  describe('on add listener function', () => {
    it('must throw an error if try to setup a listener with a different predefined event type', () => {
      const type = 'mockEventName';
      const errorMock = `${type}: Unknown event type.`;
      const callback = sinon.stub();
      const fn = () => listeners.on(type, callback);
      expect(fn).to.throw(errorMock);
    });

    it('must throw an error if try to setup a listener without a callback', () => {
      const errorMock = 'No function callback passed to subscribe on the listener.';
      // const callback = sinon.stub();
      const type = events.ERROR;
      const fn = () => listeners.on(type);
      expect(fn).to.throw(errorMock);
    });

    it('must add a callback listener', () => {
      const callback = sinon.stub();
      const type = events.ERROR;
      const errorMock1 = `${type}: Unknown event type.`;
      const errorMock2 = 'No function callback passed to subscribe on the listener.';
      const fn = () => listeners.on(type, callback);
      expect(fn).not.to.throw(errorMock1);
      expect(fn).not.to.throw(errorMock2);
      expect(callback.callCount).to.be.eq(0);
    });
  });

  describe('notify listeners function', () => {
    it('must return false when try to notify to listeners with a different predefined event type', () => {
      const type = 'mockEventName';
      const payload = 'mock data';
      const result = listeners.notify(type, payload);
      expect(result).to.be.eq(false);
    });

    it('must return false when try to notify and have no payload', () => {
      const type = events.ERROR;
      const result = listeners.notify(type);
      expect(result).to.be.eq(false);
    });

    it('must return false when try to notify and no listeners added previously', () => {
      const type = events.SUCCESS;
      const payload = 'mock data';
      const result = listeners.notify(type, payload);
      expect(result).to.be.eq(false);
    });

    it('must notify a callback listener', () => {
      const callback = sinon.stub();
      const payload = 'mock data';
      const type = events.ERROR;
      listeners.on(type, callback);
      const result = listeners.notify(type, payload);
      expect(callback.callCount).to.be.eq(1);
      expect(result).not.to.be.eq('undefined');
    });
  });

  describe('remove listener function', () => {
    it('must throw an error if try to remove a listener with a different predefined event type', () => {
      const type = 'mockEventName';
      const errorMock = `${type}: Unknown event type.`;
      const callback = sinon.stub();
      const fn = () => listeners.remove(type, callback);
      expect(fn).to.throw(errorMock);
    });

    it('must throw an error if try to remove a listener without a callback', () => {
      const errorMock = 'No function callback passed to subscribe on the listener.';
      // const callback = sinon.stub();
      const type = events.ERROR;
      const fn = () => listeners.remove(type);
      expect(fn).to.throw(errorMock);
    });

    it('must remove a callback listener', () => {
      const callback = sinon.stub();
      const type = events.ERROR;
      const errorMock1 = `${type}: Unknown event type.`;
      const errorMock2 = 'No function callback passed to subscribe on the listener.';
      const fn = () => listeners.remove(type, callback);
      expect(fn).not.to.throw(errorMock1);
      expect(fn).not.to.throw(errorMock2);
      expect(callback.callCount).to.be.eq(0);
    });
  });
});
