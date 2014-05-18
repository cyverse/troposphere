define(
  [
    'react',
    'components/common/time',
    'url',
    'controllers/projects',
    'components/common/button_dropdown',
    './ProjectItemMixin'
  ],
  function(React, Time, URL, ProjectController, ButtonDropdown, ProjectItemMixin) {

    var InstanceProjectItem = React.createClass({
        mixins: [ProjectItemMixin],
        getClassName: function() {
            return 'instance';
        },
        renderName: function() {
            var instance = this.props.model;
            return React.DOM.a({
                href: URL.instance(instance, {absolute: true}),
                onClick: function(e) {
                    e.preventDefault();
                    Backbone.history.navigate(URL.instance(instance), {trigger: true});
                }}, this.props.model.get('name_or_id'));
        },
        renderDetails: function() {
            var machine_name = this.props.model.get('machine_name') ||
                this.props.model.get('machine_alias');
            var ip = this.props.model.get('public_ip_address');
            return [ip ? ip + ', ' : '',  'from ',
                React.DOM.a({}, machine_name)];
        }
    });

    var VolumeProjectItem = React.createClass({
        mixins: [ProjectItemMixin],
        getClassName: function() {
            return 'volume';
        },
        renderName: function() {
            var volume = this.props.model;
            return React.DOM.a({
                href: URL.volume(volume, {absolute: true}),
                onClick: function(e) {
                    e.preventDefault();
                    Backbone.history.navigate(URL.volume(volume), {trigger: true});
                }}, volume.get('name_or_id'));
        },
        renderDetails: function() {
            return [this.props.model.get('size') + ' GB, created ',
                Time({date: this.props.model.get('start_date')})];
        }
    });

    var ProjectItems = React.createClass({
        confirmDelete: function() {
            ProjectController.delete(this.props.project);
        },
        render: function() {
            var project = this.props.project;

            var content;
            if (project.isEmpty()) {
                var children = [React.DOM.span({className: 'no-project-items'},
                    "Empty project. ")];
                if (project.canBeDeleted())
                    children.push(React.DOM.a({href: '#', onClick: this.confirmDelete},
                        "Delete " + project.get('name')));
                content = React.DOM.div({}, children);
            } else {
                var items = [];
                items = items.concat(project.get('instances').map(function(instance) {
                    return InstanceProjectItem({key: instance.id,
                        model: instance,
                        projects: this.props.projects,
                        project: project});
                }.bind(this)));
                items = items.concat(project.get('volumes').map(function(volume) {
                    return VolumeProjectItem({key: volume.id,
                        model: volume,
                        projects: this.props.projects,
                        project: project});
                }.bind(this)));
                content = React.DOM.ul({className: 'project-items container-fluid'}, items);
            }

            return React.DOM.div({className: 'project-contents'}, content);
        }
    });

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
