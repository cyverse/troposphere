define(['react', 'underscore', 'components/page_header', 'components/intro', 'collections/projects'], function(React, _, PageHeader, Intro, ProjectCollection) {

    var ProjectsList = React.createClass({
        render: function() {
            return React.DOM.ul({});
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
            return React.DOM.div({},
                PageHeader({title: "Projects", helpText: this.helpText}),
                React.DOM.p({}, "Welcome to Atmosphere!"),
                Intro()
            );
        },
        updateProjects: function(projects) {
            if (this.isMounted())
                this.setState({projects: projects});
        },
        componentDidMount: function() {
            var projects = new ProjectCollection();
            projects.on('sync', this.updateApplications);
            projects.fetch();
        },
        componentWillUnmount: function() {
            if (this.state.projects)
                this.state.projects.off('sync', this.updateProjects);
        }
    });

    return Projects;
});
