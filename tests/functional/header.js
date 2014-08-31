define([
  'intern!bdd',
  'intern/chai!'
], function (bdd, chai) {

  chai.should();
  var findTimeout = 1000;
  var url_loggedIn = "http://localhost:8080/tests" + "?test=root_loggedIn";
  var url_loggedOut = "http://localhost:8080/tests" + "?test=root_loggedOut";

  with (bdd) {

    describe("Header", function () {

      describe("when user is logged in", function(){
        it("should display users name", function () {
          return this.remote
            .get(url_loggedIn)
            .setFindTimeout(findTimeout)
            .findByCssSelector('.dropdown-toggle span')
              .click()
              .getVisibleText()
              .then(function (text) {
                text.should.equal('testUser');
              });
        });

        it("should display correct links in header", function () {
          return this.remote
            .get(url_loggedIn)
            .setFindTimeout(findTimeout)
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
      });

      describe("when user is not logged in", function(){
        it("should display a login link", function(){
          return this.remote
            .get(url_loggedOut)
            .setFindTimeout(findTimeout)
            .findByCssSelector('.dropdown a')
              .getAttribute("href")
              .then(function (href) {
                href.should.equal("/login");
              })
              .getVisibleText()
              .then(function (text) {
                text.should.equal('Login');
              });
        });

        it("should display correct links in header", function(){
          return this.remote
            .get(url_loggedOut)
            .setFindTimeout(findTimeout)
            .findAllByCssSelector('ul.navbar-nav:first-child li a')
              .getVisibleText()
              .then(function (links) {
                links.length.should.equal(2);
                links[0].should.equal('Images');
                links[1].should.equal('Help');
              });
        });
      })


    })

  }

});