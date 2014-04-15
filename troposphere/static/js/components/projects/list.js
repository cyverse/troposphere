define(['backbone', 'react', 'underscore', 'components/page_header',
'components/intro', 'collections/projects', 'rsvp',
'components/mixins/loading', 'components/projects/project'],
function(Backbone, React, _, PageHeader, Intro, ProjectCollection, RSVP,
LoadingMixin, Project) {

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

    var ProjectsView = React.createClass({
        mixins: [LoadingMixin],
        model: function() {
            return new RSVP.Promise(function(resolve, reject) {
                new ProjectCollection().fetch({
                    success: function(coll) {
                        resolve(coll);
                    }
                });
            });
        },
        renderContent: function() {
            return Projects({projects: this.state.model});
        }
    });

    return ProjectsView;
});
