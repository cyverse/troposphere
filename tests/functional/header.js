define([
  'intern!bdd',
  'intern/chai!'
], function (bdd, chai) {

  chai.should();
  var url = "http://localhost:8080/tests";

  with (bdd) {

    describe("Header", function () {
      it("should display users name", function () {
        return this.remote
          .get(url)
          .setFindTimeout(5000)
          .findByCssSelector('.dropdown-toggle span')
          .click()
          .getVisibleText()
          .then(function (text) {
            text.should.equal('testUser');
          });
      });
    })

  }

});