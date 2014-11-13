define(
  [
    'react',
    'backbone',
    'components/projects/list/Project.react',
    'test/fixtures/project.fixture'
  ], function(React, Backbone, ProjectComponent, projectFixture) {

    var TestUtils,
        projectElement;

      describe("Project Card", function(){

        beforeEach(function() {
          TestUtils = React.addons.TestUtils;

          var projectCard = ProjectComponent({project: projectFixture});
          projectElement = TestUtils.renderIntoDocument(projectCard);
        });

        describe("project stats", function(){

          var projectStatElements;

          beforeEach(function(){
            var projectStatsElement = TestUtils.findRenderedDOMComponentWithTag(projectElement, "ul");
            projectStatElements = TestUtils.scryRenderedDOMComponentsWithTag(projectStatsElement, "li");
          });

          it("should show three project stats", function(){
            expect(projectStatElements.length).toBe(3);
          });

          describe("first stat", function(){
            var statElement;

            beforeEach(function(){
              statElement = projectStatElements[0];
            });

            it("should be instances", function(){
              var icon = TestUtils.scryRenderedDOMComponentsWithClass(statElement, "glyphicon-tasks");
              expect(icon.length).toBe(1);
            });

            it("should display instance count", function(){
              var countElement = TestUtils.findRenderedDOMComponentWithTag(statElement, "span");
              var node = countElement.getDOMNode();
              expect(node.textContent).toBe(projectFixture.get('instances').length.toString());
            })
          });

          describe("second stat", function(){
            var statElement;

            beforeEach(function(){
              statElement = projectStatElements[1];
            });

            it("should be volumes", function(){
              var icon = TestUtils.scryRenderedDOMComponentsWithClass(statElement, "glyphicon-hdd");
              expect(icon.length).toBe(1);
            });

            it("should display volume count", function(){
              var countElement = TestUtils.findRenderedDOMComponentWithTag(statElement, "span");
              var node = countElement.getDOMNode();
              expect(node.textContent).toBe(projectFixture.get('volumes').length.toString());
            })
          });

          describe("third stat", function(){
            var statElement;

            beforeEach(function(){
              statElement = projectStatElements[2];
            });

            it("should be images", function(){
              var icon = TestUtils.scryRenderedDOMComponentsWithClass(statElement, "glyphicon-floppy-disk");
              expect(icon.length).toBe(1);
            });

            it("should display image count", function(){
              var countElement = TestUtils.findRenderedDOMComponentWithTag(statElement, "span");
              var node = countElement.getDOMNode();
              expect(node.textContent).toBe(projectFixture.get('applications').length.toString());
            })
          })

        });
      });

});
