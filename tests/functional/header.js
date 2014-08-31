define([
  'intern!bdd',
  'intern/chai!'
], function (bdd, chai) {

  chai.should();
  var url = "http://localhost:8080/tests" + "?test=root_loggedIn";

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

      it("should display correct links in header", function () {
        return this.remote
          .get(url)
          .setFindTimeout(5000)
          .findAllByCssSelector('ul.navbar-nav:first-child li a')
            .getVisibleText()
            .then(function (links) {
              links.length.should.equal(5);
              links[0].should.equal('Dashboard');
              links[1].should.equal('Projects');
              links[2].should.equal('Images');
              links[3].should.equal('Providers');
              links[4].should.equal('Help');
            });
      });
    })

  }

});