define([
  'intern!bdd',
  'intern/chai!'
], function (bdd, chai) {

  chai.should();
  var findTimeout = 1000;
  var url = "http://localhost:8080/tests" + "?test=projects/listView";

  with (bdd) {

    describe("Projects List View", function () {

      describe("when user has projects", function(){

        it("should display a card for each project", function () {
          return this.remote
            .get(url)
            .setFindTimeout(findTimeout)
            .findAllByCssSelector('.project-list li h2')
              .getVisibleText()
              .then(function (links) {
                links.length.should.equal(2);
                links[0].should.equal('Project 1');
                links[1].should.equal('Project 2');
              });
        });
      });

    })

  }

});