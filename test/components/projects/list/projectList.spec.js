define(
  [
    'react',
    'backbone',
    'components/projects/list/ProjectList.react',
    'test/fixtures/projects.fixture',
    'components/projects/list/Project.react'
  ], function(React, Backbone, ProjectListView, projects, ProjectElement) {

    var TestUtils,
        listViewElement;

    describe('Project List', function() {

      beforeEach(function() {
        TestUtils = React.addons.TestUtils;

        var listView = ProjectListView({projects: projects});
        listViewElement = TestUtils.renderIntoDocument(listView);
      });

      it("should display 2 cards if given 2 projects", function () {
        var projectListItems = TestUtils.scryRenderedComponentsWithType(listViewElement, ProjectElement);
        expect(projectListItems.length).toBe(projects.length);
      });

      describe("new project button", function(){
        it("should exist");
        it("should open the new project modal");
      });

    });

});
