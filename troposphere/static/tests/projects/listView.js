require(
  [
    'jquery',
    'react',
    'backbone',

    // test utilities
    'sinon',
    'stores/MockStore',
    'stores',
    'actions',

    // component under test
    'components/projects/ProjectListPage.react'
  ],
  function ($, React, Backbone, sinon, MockStore, stores, actions, ProjectListPage) {

    // set up the stores the application will be using
    var mockProfile = new Backbone.Model({username: "testUser"});

    // setup mock stores
    var mockProjectStore = MockStore();
    mockProjectStore.getAll = sinon.stub().returns(new Backbone.Collection([
      {
        name: "Project 1"
      },{
        name: "Project 2"
      }
    ]));

    stores.ProjectStore = mockProjectStore;

    $(document).ready(function () {
      React.renderComponent(ProjectListPage(), document.getElementById('application'));
    });

  });
