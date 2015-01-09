define(
  [
    'react',
    'backbone',
    'components/projects/list/ProjectListView.react',
    'components/projects/common/ProjectListHeader.react',
    'test/fixtures/projects.fixture',
    'actions',
    'stores'
  ], function(React, Backbone, ProjectListView, ProjectListHeader, projectCollectionFixture, actions, stores) {

    var TestUtils,
        projectViewElement;

    describe('Project List View', function() {

      beforeEach(function() {
        TestUtils = React.addons.TestUtils;

        var listView = ProjectListView({projects: projectCollectionFixture});
        projectViewElement = TestUtils.renderIntoDocument(listView);

        for(var action in actions) delete actions[action];
        for(var store in stores) delete stores[store];
      });

      it("should have a header", function(){
        var headerElement = TestUtils.scryRenderedComponentsWithType(projectViewElement, ProjectListHeader);
        expect(headerElement.length).toBe(1);
      });

      describe("create project button", function(){
        it("should exist", function(){
          var headerElement = TestUtils.scryRenderedComponentsWithType(projectViewElement, ProjectListHeader);
          expect(headerElement.length).toBe(1);
        });

        it("should have read 'Create New Project'", function(){
          var button = TestUtils.findRenderedDOMComponentWithTag(projectViewElement, "button");
          expect(button.getDOMNode().textContent).toBe("Create New Project");
        });

        it("should open the new project modal when clicked", function(){
          actions.ProjectActions = {
            create: sinon.spy()
          };
          var button = TestUtils.findRenderedDOMComponentWithTag(projectViewElement, "button");
          TestUtils.Simulate.click(button);
          expect(actions.ProjectActions.create.calledOnce).toBe(true);
        });
      });


    });

});
