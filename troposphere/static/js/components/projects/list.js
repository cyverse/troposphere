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
    var NewProjectModal = require('./NewProjectModal');

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
