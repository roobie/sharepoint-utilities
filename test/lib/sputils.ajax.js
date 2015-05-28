describe('AJAX', function () {
  'use strict';

  var placeHolderApi = 'http://localhost:9000',
      existingItem = placeHolderApi + '/things/1',
      missingItem = placeHolderApi + '/thing/101';

  it('should have a namespace', function () {
    expect(sputils).to.have.ownProperty('ajax');
  });

  describe('ajax', function () {
    // 'low level' API
    it('should execute/initate an XHR and return the xhr object', function (done) {
      var xhr = sputils.ajax({
        url: existingItem,
        method: 'GET'
      }, function (status, response, request) {
        expect(status).to.equal(200);
        expect(response).to.not.be.a.string();
        expect(request).to.equal(xhr);
        done();
      });
      expect(xhr).not.to.be.null;
    })
  })

  describe('get', function () {
    it('should allow a url as parameter to get data from the API', function (done) {
      sputils.ajax.get(existingItem).then(function (result) {
        expect(result.data.id).to.equal(1);
      }).then(done);
    });

    it('should be rejected when status is not 2xx', function (done) {
      sputils.ajax.get(missingItem).then(
        function () {
          throw new Error();
        },
        function (reason) {
          expect(reason.error.constructor).to.be.equal(Error);
          expect(reason.status).to.equal(404);
          done();
        });
    });
  });
});
