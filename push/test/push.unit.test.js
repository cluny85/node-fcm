var expect = require('chai').expect,
    push   = require('../../index'),
    pushType   = require('../../pushTemplates'),
    mock = require('./fcmMock.json');
    // mock = require('./tokensMock.json');

// mock tokens can make return fail if they are not active in the app

describe('[Unit] Push notifications with Firebase', function(){

  describe('.send CANCEL_CALL', function(){
    it('must return a response from firebase', function(done){
      expect(mock.token).to.exist;
      push.send(mock.token,pushType.cancel_call).
      then( res=>{
        expect(res).to.exist;
        expect(res).to.have.property('tokens');
        expect(res).to.have.property('success');
        expect(res.tokens).to.be.eq(res.success);
        done();
      }).
      catch( err=>{
        console.log(err)
        expect(err).to.not.exist;
        done();
      });
    });
  });

  describe('.send CHAT_MESSAGE', function(){
    it('must return a response from firebase', function(done){
      expect(mock.token).to.exist;
      expect(mock.chat).to.exist;
      push.send(mock.token,pushType.chat_message,mock.chat).
      then( res=>{
        expect(res).to.exist;
        expect(res).to.have.property('tokens');
        expect(res).to.have.property('success');
        expect(res.tokens).to.be.eq(res.success);
        done();
      }).
      catch( err=>{
        expect(err).to.not.exist;
        done();
      });
    });
  });

  describe('.send uninstalled token', function(){
    it('must return a response from firebase and capture the event through the listener', function(done){
      //this.timeout(10000);
      expect(mock.tokenUninstalled).to.exist;
      expect(mock.chat).to.exist;
      const uninstalledListener = (token)=>{
        expect(token).to.exist;
        push.remove(push.events.UNINSTALLED,uninstalledListener);
        done();
      }
      push.on(push.events.UNINSTALLED,uninstalledListener);
      push.on(push.events.ERROR,(err)=>{
        expect(err).to.not.exist;
        done();
      });
      push.send(mock.tokenUninstalled,pushType.cancel_call).
      catch( err=>{
        expect(err).to.not.exist;
        done();
      });
    });
  });

  describe('.send massive pushes', function(){
    it('must send to a multiple tokens (android/ios) and return a correct response from firebase fcm', function(done){
      done();      
    });
  });

  // describe('', function(){
  //   it('must send a silent push notification', function(done){
  //     //this.timeout(10000);
  //     expect(mock.token).to.exist;
  //     expect(mock.token).to.be.an('string');
  //     //expect(mock.tokens).to.be.gt(0);
  //     push.sendCancelCall({},{tokens: mock.token}).
  //     then( res=>{
  //       expect(res).to.exist;
  //       expect(res).to.have.property('tokens');
  //       expect(res).to.have.property('success');
  //       expect(res.tokens).to.be.eq(res.success);
  //       done();
  //     }).
  //     catch( err=>{
  //       expect(err).to.not.exist;   
  //       done();
  //     });
  //   });
  // });

});
