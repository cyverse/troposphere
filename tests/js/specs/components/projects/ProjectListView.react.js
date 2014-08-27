define(['squire', 'sinon'], function (Squire, sinon) {

  describe('Project List Page', function () {

    describe('new project button', function () {
      it("should open the new project modal when clicked", function(done){
        var squire = new Squire();

        squire.mock({
          'actions/ProjectActions': sinon.mock()
        });

        var createProjectStub = sinon.stub();
        squire.mock('actions/ProjectActions', {create: createProjectStub});

        squire.require([
          'react',
          'components/projects/list/ProjectListView.react',
          'collections/ProjectCollection'
        ], function (React, ProjectListView, ProjectCollection) {
          var TestUtils = React.addons.TestUtils;

          // arrange
          var projects = new ProjectCollection([]);

          var view = $(TestUtils.renderIntoDocument(ProjectListView({
            projects: projects
          })).getDOMNode());

          // act
          var createProjectButton = view.find("button")[0];
          TestUtils.Simulate.click(createProjectButton);

          // assert
          createProjectStub.calledOnce.should.be.true;
          done();
        });
      })
    });

    describe('project list', function(){
      it("should show a card for each project", function(done){
        var squire = new Squire();

        squire.mock({
          'actions/ProjectActions': sinon.mock()
        });

        squire.require([
          'react',
          'components/projects/list/ProjectListView.react',
          'collections/ProjectCollection'
        ], function (React, ProjectListView, ProjectCollection) {
          var TestUtils = React.addons.TestUtils;

          // arrange
          var projects = new ProjectCollection([{
            name: "Project1"
          }, {
            name: "Project2"
          }]);

          var view = $(TestUtils.renderIntoDocument(ProjectListView({
            projects: projects
          })).getDOMNode());

          // act
          var listItems = view.find("#project-list li");

          // assert
          listItems.length.should.equal(2);
          done();
        });
      })
    })

  });

});
