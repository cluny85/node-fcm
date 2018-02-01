const { expect } = require('chai');
const { firebase } = require('./mockConfig');
const pushType = require('../exampleTemplates');
const mock     = require('./fcmMock.json');

let push;
// mock tokens can make return fail if they are not active in the app

describe('[e2e] Push notifications with Firebase', () => {
  before(() => {
    // must check if firebase config file has been provided
    try {
      push = require('../index')(firebase);
    } catch (error) {
      expect(error).to.not.exist;
    }
  });

  describe('.init', () => {
    it('must init firebase', (done) => {
      expect(push).to.exist;
      expect(push).to.have.property('send');
      expect(push).to.have.all.keys('send', 'events', 'on', 'remove', 'templates', 'utils');
      done();
    });
  });

  describe('.send CANCEL_CALL', () => {
    it('must return a response from firebase', async () => {
      const eventMock = {
        tokens: mock.token,
        type  : pushType.cancel_call
      };
      try {
        const result = await push.send(eventMock);
        expect(result).to.exist;
        expect(result).to.have.property('tokens');
        expect(result).to.have.property('success');
        expect(result.tokens).to.be.eq(result.success);
      } catch (err) {
        expect(err).to.not.exist;
      }
    });
  });

  describe.skip('.send CHAT_MESSAGE', () => {
    it('must return a response from firebase', (done) => {
      const eventMock = {
        tokens : mock.token,
        type   : pushType.chat_message,
        payload: mock.chat
      };
      push.send(eventMock)
        .then((res) => {
          expect(res).to.exist;
          expect(res).to.have.property('tokens');
          expect(res).to.have.property('success');
          expect(res.tokens).to.be.eq(res.success);
          done();
        })
        .catch((err) => {
          expect(err).to.not.exist;
        });
    });
  });

  describe.skip('.send uninstalled token', () => {
    it('must return a response from firebase and capture the event through the listener', (done) => {
      // this.timeout(10000);
      const eventMock = {
        tokens: mock.tokenUninstalled,
        type  : pushType.cancel_call
      };
      const onError = err => expect(err).to.not.exist;
      const uninstalledListener = (token) => {
        expect(token).to.exist;
        expect(token).to.be.an('string');
        push.remove(push.events.UNINSTALLED, uninstalledListener);
        push.remove(push.events.ERROR, onError);
        done();
      };

      push.on(push.events.UNINSTALLED, uninstalledListener);
      push.on(push.events.ERROR, onError);
      push.send(eventMock)
        .catch(onError);
    });
  });

  describe.skip('.send massive pushes', () => {
    it('must send to a multiple tokens (android/ios) and return a correct response from firebase fcm', (done) => {
      done();
    });
  });

  after(() => {
    // runs after all tests in this block

  });
});
