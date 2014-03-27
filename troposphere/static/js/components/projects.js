define(['react', 'underscore', 'components/page_header',
'components/intro', 'collections/projects'], function(React, _,
PageHeader, Intro, ProjectCollection) {

    var ProjectItems = React.createClass({
        render: function() {
            var project = this.props.project;
            var items = [];
            items = items.concat(project.get('instances').map(function(instance) {
                return React.DOM.li({}, instance.id);
            }));

            return React.DOM.ul({className: 'project-items'}, items);
        }
    });

    var Project = React.createClass({
        render: function() {
            var project = this.props.project;
            console.log(project);
            return React.DOM.li({}, React.DOM.h2({}, project.get('name')), 
                React.DOM.div({className: 'project-description'}, React.DOM.p({}, project.get('description'))),
                ProjectItems({project: project}));
        }
    });

    var ProjectsList = React.createClass({
        render: function() {
            var items = this.props.projects.map(function(model) {
                return Project({key: model.id, project: model});
            });
            return React.DOM.ul({id: 'project-list'}, items);
        }
    });

    var Projects = React.createClass({
        helpText: function() {
            return React.DOM.p({}, "Projects help you organize your cloud resources");
        },
        render: function() {
            var content = ProjectsList({projects: this.props.projects});

            return React.DOM.div({},
                PageHeader({title: "Projects", helpText: this.helpText}),
                content
            );
        }
    });

    return Projects;
});
