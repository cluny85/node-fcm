var expect   = require('chai').expect,
    config   = require("./mock.env").firebase,
    push     = require('../index')(config),
    pushType = require('../exampleTemplates'),
    mock     = require('./fcmMock.json');

// mock tokens can make return fail if they are not active in the app

describe('[Unit] Push notifications with Firebase', function(){

  describe('.init', function(){
    it('must init firebase', function(done){
      expect(push).to.exist;
      expect(push).to.have.property('send');
      expect(push).to.have.all.keys('send', 'events', 'on', 'remove', 'templates', 'utils');
      done();
    });
  });
  
  describe('.send CANCEL_CALL', function(){
    it('must return a response from firebase', function(done){
      push.send(mock.token,pushType.cancel_call)
      .then( res=>{
        expect(res).to.exist;
        expect(res).to.have.property('tokens');
        expect(res).to.have.property('success');
        expect(res.tokens).to.be.eq(res.success);
        done();
      })
      .catch( err=>{
        console.log(err)
        expect(err).to.not.exist;
        done();
      });
    });
  });

  describe('.send CHAT_MESSAGE', function(){
    it('must return a response from firebase', function(done){
      push.send(mock.token,pushType.chat_message,mock.chat)
      .then( res=>{
        expect(res).to.exist;
        expect(res).to.have.property('tokens');
        expect(res).to.have.property('success');
        expect(res.tokens).to.be.eq(res.success);
        done();
      })
      .catch( err=>{
        expect(err).to.not.exist;
        done();
      });
    });
  });

  describe('.send uninstalled token', function(){
    it('must return a response from firebase and capture the event through the listener', function(done){
      //this.timeout(10000);
      const uninstalledListener = (token)=>{
        expect(token).to.exist;
        push.remove(push.events.UNINSTALLED,uninstalledListener);
        done();
      }
      const onError = (err) => expect(err).to.not.exist;

      push.on(push.events.UNINSTALLED,uninstalledListener);
      push.on(push.events.ERROR, onError);
      push.send(mock.tokenUninstalled,pushType.cancel_call)
      .catch(onError);
    });
  });

  describe('.send massive pushes', function(){
    it('must send to a multiple tokens (android/ios) and return a correct response from firebase fcm', function(done){
      done();      
    });
  });

});
