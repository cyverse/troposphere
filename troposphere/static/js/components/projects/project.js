define(
  [
    'react',
    'components/common/time',
    'url',
    'controllers/projects',
    'components/common/button_dropdown',
    './ProjectItemMixin',
    './InstanceProjectItem',
    './VolumeProjectItem',
    './ProjectItems'
  ],
  function(React, Time, URL, ProjectController, ButtonDropdown, ProjectItemMixin, InstanceProjectItem, VolumeProjectItem, ProjectItems) {

    var ProjectDescription = React.createClass({
        getInitialState: function() {
            return {
                editing: false,
                saving: false
            };
        },
        startEditing: function(e) {
            e.preventDefault();
            this.setState({editing: true});
        },
        updateDescription: function(e) {
            this.props.project.set('description', e.target.value);
        },
        save: function() {
            this.setState({saving: true}, function() {
                this.props.project.save(null, {
                    patch: true,
                    wait: true,
                    success: function() {
                        this.setState({editing: false, saving: false});
                    }.bind(this)
                });
            }.bind(this));
        },
        renderEditing: function() {
            var project = this.props.project;
            return [
                React.DOM.div({className: 'form-group'},
                    React.DOM.textarea({
                        value: project.get('description'),
                        className: 'form-control',
                        rows: 7,
                        onChange: this.updateDescription
                    })),
                React.DOM.p({},
                    React.DOM.button({className: 'btn btn-primary',
                        onClick: this.save,
                        disabled: this.state.saving},
                        this.state.saving ? "Saving..." : "Save"))];
        },
        renderNotEditing: function() {
            var project = this.props.project;
            var description = project.get('description') || React.DOM.em({}, 'No description');
            return [React.DOM.a({href: '#', onClick: this.startEditing}, 'Edit Description'),
                React.DOM.p({}, description)];
        },
        render: function() {
            var content;
            if (this.state.editing)
                content = this.renderEditing();
            else
                content = this.renderNotEditing();
            return React.DOM.div({className: 'project-description'},content);
        }
    });

    var Project = React.createClass({
        render: function() {
            var project = this.props.project;
            console.log(project);
            return React.DOM.li({},
                React.DOM.h2({},
                    project.get('name')),
                React.DOM.a({href: '#', className: 'btn btn-primary update-project-btn'}, '+'),
                ProjectDescription({project: project}),
                ProjectItems({project: project, projects: this.props.projects}));
        }
    });

    return Project;

});
