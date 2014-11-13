define(
  [
    'collections/ProjectCollection',
    'models/Project'
  ], function(ProjectCollection, Project) {

    var project1 =  new Project({
      id: 1,
      name: "Project1 Name",
      description: "Project1 description",
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
    }, {parse: true});

    var project2 =  new Project({
      id: 2,
      name: "Project2 Name",
      description: "Project2 description",
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
    }, {parse: true});

    return new ProjectCollection([project1, project2]);

});
