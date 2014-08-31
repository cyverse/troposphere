define([
  'intern!bdd',
  'intern/chai!'
], function (bdd, chai) {

  chai.should();
  var url = "http://localhost:8080/tests" + "?test=root_loggedIn";

  with (bdd) {

    describe("Footer", function () {

      it("should display a link to the user management portal", function () {
        return this.remote
          .get(url)
          .setFindTimeout(5000)
          .findByCssSelector('footer a')
            .getAttribute("href")
            .then(function (href) {
              href.should.equal("http://user.iplantcollaborative.org");
            })
            .getVisibleText()
            .then(function (text) {
              text.should.equal('©2014 iPlant Collaborative');
            });
      });
    })

  }

});