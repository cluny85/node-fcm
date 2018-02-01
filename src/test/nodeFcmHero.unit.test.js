/* eslint no-shadow: ["error", { "allow": ["bridge"] }] */
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const hero = require('../index');

chai.use(chaiAsPromised);
const { expect } = chai;

const mocks = {
  firebase: {
    cert: 'mock',
    url : 'mock'
  }
};

describe('[unit] node-fcm-hero index', () => {
  it('must throw an error if firebase configuration is not defined', () => {
    const fn = () => hero();
    expect(fn).to.throw('Must provide an object with the firebase initialization.');
  });

  it('must throw an error if firebase configuration params are not defined', () => {
    const fn = () => hero({});
    expect(fn).to.throw('Firebase config must provide a cert field.');
  });

  it('must receive the config file and return json objcet', () => {
    const firebaseStub = sinon.stub();
    const firebase = proxyquire('../index', { './lib/firebase': firebaseStub });
    const result = firebase(mocks.firebase);
    ['on', 'remove', 'send'].forEach((key) => {
      expect(result).to.any.have.key(key);
      expect(result[key]).to.be.a('function');
    });
    ['events', 'utils', 'templates'].forEach((key) => {
      expect(result).to.any.have.key(key);
      expect(result[key]).to.be.a('object');
    });
    expect(firebaseStub.calledOnce).to.be.equal(true);
  });

  it('must receive the config file and the firebaseAdmin messaging insance and return json objcet', () => {
    const firebaseStub = sinon.stub();
    // const firebase = proxyquire('../index', { './lib/firebase': firebaseStub });
    const result = hero(mocks.firebase, firebaseStub);
    ['on', 'remove', 'send'].forEach((key) => {
      expect(result).to.any.have.key(key);
      expect(result[key]).to.be.a('function');
    });
    ['events', 'utils', 'templates'].forEach((key) => {
      expect(result).to.any.have.key(key);
      expect(result[key]).to.be.a('object');
    });
    expect(firebaseStub.calledOnce).to.be.equal(false);
  });

  it('must return all events pre defined', () => {
    const firebaseStub = sinon.stub();
    const firebase = proxyquire('../index', { './lib/firebase': firebaseStub });
    const fcm = firebase(mocks.firebase);
    const { events } = fcm;
    ['UNINSTALLED', 'RENEW_CREDENTIALS', 'FIREBASE_ERROR', 'ERROR', 'SUCCESS'].forEach((key) => {
      expect(events).to.any.have.key(key);
      expect(events[key]).to.be.a('string');
    });
  });
});
