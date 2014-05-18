define(function(require) {

    var Backbone = require('backbone');
    var React = require('react');
    var _ = require('underscore');
    var PageHeader = require('components/page_header');
    var Intro = require('./Intro');
    var ProjectController = require('controllers/projects');
    var RSVP = require('rsvp');
    var LoadingMixin = require('components/mixins/loading');
    var Project = require('components/projects/Project');
    var ModalMixin = require('components/mixins/modal');
    var Modal = require('modal');
    var ProjectsList = require('./ProjectsList');

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
            ProjectController.create(this.state.projectName,
                this.state.projectDescription).then(function(model) {
                    this.props.projects.add(model);
                    this.close();
                }.bind(this));
        },
        renderFooter: function() {
            return React.DOM.button({
                className: 'btn btn-primary',
                onClick: this.createProject
            }, "Create");
        }
    });

    return React.createClass({
        helpText: function() {
            return React.DOM.p({}, "Projects help you organize your cloud resources");
        },
        launchNewProjectModal: function() {
            Modal.show(NewProjectModal({projects: this.props.projects}));
        },
        componentDidMount: function() {
            if (!this.props.projects)
                this.props.onRequestProjects();
        },
        render: function() {
            var content;
            if (this.props.projects)
                content = ProjectsList({projects: this.props.projects});
            else
                content = React.DOM.div({className: 'loading'});

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

});
