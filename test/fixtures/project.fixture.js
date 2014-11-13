define(
  [
    'models/Project'
  ], function(Project) {

    return new Project({
      id: 1,
      name: "Project Name",
      description: "Project description",
      applications: [],
      instances: [
        {},
        {}
      ],
      volumes: [
        {},
        {}
      ],
      start_date: "2014-04-11T17:51:11.511Z"
    }, {parse: true})

});
