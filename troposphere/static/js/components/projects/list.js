define(['backbone', 'react', 'underscore', 'components/page_header',
'components/intro', 'collections/projects', 'rsvp',
'components/mixins/loading', 'components/projects/project',
'components/mixins/modal', 'modal'], function(Backbone, React, _, PageHeader,
Intro, ProjectCollection, RSVP, LoadingMixin, Project, ModalMixin, Modal) {

    var ProjectsList = React.createClass({
        render: function() {
            var items = this.props.projects.map(function(model) {
                return Project({key: model.id, project: model});
            });
            return React.DOM.ul({id: 'project-list'}, items);
        }
    });

    var NewProjectModal = React.createClass({
        mixins: [ModalMixin],
        getInitialState: function() {
            return {
                projectName: "",
                projectDescription: ""
            };
        },
        renderTitle: function() {
            return "Create Project";
        },
        renderBody: function() {
            return React.DOM.form({role: 'form', onSubmit: function(e) {e.preventDefault();}},
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'project-name'}, "Project Name"),
                    React.DOM.input({type: 'text',
                        className: 'form-control',
                        id: 'project-name',
                        onChange: function(e) {this.setState({'projectName': e.target.value});}.bind(this)
                    })),
                React.DOM.div({className: 'form-group'},
                    React.DOM.label({htmlFor: 'project-description'}, "Description"),
                    React.DOM.textarea({type: 'text',
                        className: 'form-control',
                        id: 'project-description',
                        rows: 7,
                        onChange: function(e) {this.setState({'projectDescription': e.target.value});}.bind(this)
                    })));
        },
        createProject: function() {
            console.log(this.state);
        },
        renderFooter: function() {
            return React.DOM.button({
                className: 'btn btn-primary',
                onClick: this.createProject
            }, "Create");
        }
    });

    var Projects = React.createClass({
        helpText: function() {
            return React.DOM.p({}, "Projects help you organize your cloud resources");
        },
        launchNewProjectModal: function() {
            Modal.show(NewProjectModal());
        },
        render: function() {
            var content = ProjectsList({projects: this.props.projects});

            return React.DOM.div({},
                PageHeader({title: "Projects", helpText: this.helpText}),
                React.DOM.p({},
                    React.DOM.button({
                        className: 'btn btn-primary',
                        onClick: this.launchNewProjectModal
                    }, "Create Project")),
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
