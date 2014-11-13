define(
  [
    'react',
    'backbone',
    'components/projects/list/ProjectListView.react',
    'components/projects/common/ProjectListHeader.react',
    'test/fixtures/projects.fixture',
    'actions'
  ], function(React, Backbone, ProjectListView, ProjectListHeader, projectCollectionFixture, actions) {

    var TestUtils,
        projectViewElement;

    describe('Project List View', function() {

      beforeEach(function() {
        TestUtils = React.addons.TestUtils;

        var listView = ProjectListView({projects: projectCollectionFixture});
        projectViewElement = TestUtils.renderIntoDocument(listView);
      });

      it("should have a header", function(){
        var headerElement = TestUtils.scryRenderedComponentsWithType(projectViewElement, ProjectListHeader);
        expect(headerElement.length).toBe(1);
      });

      describe("create project button", function(){
        iit("should exist", function(){
          var headerElement = TestUtils.scryRenderedComponentsWithType(projectViewElement, ProjectListHeader);
          expect(headerElement.length).toBe(1);
        });

        it("should have read 'Create New Project'", function(){
          var button = TestUtils.findRenderedDOMComponentWithTag(projectViewElement, "button");
          expect(button.textContent).toBe("Create New Project");
        });

        it("should open the new project modal when clicked", function(){
          var button = TestUtils.findRenderedDOMComponentWithTag(projectViewElement, "button");
          TestUtils.Simulate.click(button);



          expect(button.textContent).toBe("Create New Project");
        });
      });


    });

});
