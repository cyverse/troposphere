define([
  'intern!bdd',
  'intern/chai!'
], function (bdd, chai) {

  chai.should();
  var findTimeout = 1000;
  var url_loggedIn = "http://localhost:8080/tests" + "?test=root_loggedIn";
  var url_loggedOut = "http://localhost:8080/tests" + "?test=root_loggedOut";

  with (bdd) {

    describe("Footer", function () {

      describe("when user is logged in", function(){
        it("should display a link to the user management portal", function () {
          return this.remote
            .get(url_loggedIn)
            .setFindTimeout(findTimeout)
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

        it("should show a feedback and support button", function(){
          return this.remote
            .get(url_loggedIn)
            .setFindTimeout(findTimeout)
            .findByCssSelector('footer button')
              .getVisibleText()
              .then(function (text) {
                text.should.equal("Feedback & Support");
              });

        })
      });

      describe("when user is not logged in", function(){
        it("should not show a feedback and support button in the footer", function(){
          return this.remote
            .get(url_loggedOut)
            .setFindTimeout(findTimeout)
            .findAllByCssSelector('footer button')
              .then(function (elements) {
                elements.length.should.equal(0);
              });
        });
      })
    })

  }

});