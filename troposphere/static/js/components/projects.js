define(['react', 'underscore', 'components/page_header', 'components/intro', 'collections/projects'], function(React, _, PageHeader, Intro, ProjectCollection) {

    var ProjectsList = React.createClass({
        render: function() {
            var items = this.props.projects.map(function(model) {
                return React.DOM.li({key: model.id}, model.get('name'));
            });
            return React.DOM.ul({}, items);
        }
    });

    var Projects = React.createClass({
        getInitialState: function() {
            return {
                projects: null
            };
        },
        helpText: function() {
            return React.DOM.p({}, "Projects help you organize your cloud resources");
        },
        render: function() {
            var content;
            if (this.state.projects === null) {
                content = [
                    React.DOM.p({}, "Welcome to Atmosphere!"),
                    Intro()
                ];
            } else {
                content = ProjectsList({projects: this.state.projects});
            }

            return React.DOM.div({},
                PageHeader({title: "Projects", helpText: this.helpText}),
                content
            );
        },
        updateProjects: function(projects) {
            if (this.isMounted())
                this.setState({projects: projects});
        },
        componentDidMount: function() {
            var projects = new ProjectCollection();
            projects.on('sync', this.updateProjects);
            projects.fetch();
        },
        componentWillUnmount: function() {
            if (this.state.projects)
                this.state.projects.off('sync', this.updateProjects);
        }
    });

    return Projects;
});
