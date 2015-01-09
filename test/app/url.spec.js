define(
  [
    'url'
  ], function(URL) {

    describe("URL", function(){

      beforeEach(function() {

      });

      it("should generate url for a project", function(){
        var project = {id: 1};
        var url = URL.project(project, {relative: true});
        expect(url).toBe("/projects/1");
      });

      it("should generate url for an image", function(){
        var image = {id: 1};
        var url = URL.application(image, {relative: true});
        expect(url).toBe("/images/1");
      });

      it("should generate url for an image", function(){
        var project = {id: 1};
        var url = URL.projectResources({project: project}, {relative: true});
        expect(url).toBe("/projects/1/resources");
      });

    });

});
