define(['backbone', 'react', 'underscore', 'components/page_header',
'components/intro', 'collections/projects',
'components/common/time', 'rsvp', 'components/mixins/loading'], function(Backbone, React, _,
PageHeader, Intro, ProjectCollection, Time, RSVP, LoadingMixin) {

    var ProjectItemMixin = {
        render: function() {
            return React.DOM.li({className: 'project-item row ' + this.getClassName()},
                React.DOM.div({className: 'project-item-name col-md-6'}, this.renderName()),
                React.DOM.div({className: 'project-item-details col-md-6'}, this.renderDetails()));
        }
    };

    var InstanceProjectItem = React.createClass({
        mixins: [ProjectItemMixin],
        getClassName: function() {
            return 'instance';
        },
        renderName: function() {
            var instance = this.props.model;
            /* TODO: Move this to the model */
            var instance_url = function(instance) {
                var provider_id = instance.get('identity').provider;
                var identity_id = instance.get('identity').id;
                return 'provider/' + provider_id + '/identity/' + identity_id + '/instances/' + instance.id;
            };
            return React.DOM.a({
                href: url_root + '/' + instance_url(instance),
                onClick: function(e) {
                    e.preventDefault();
                    Backbone.history.navigate(instance_url(instance), {trigger: true});
                }}, this.props.model.get('name_or_id'));
        },
        renderDetails: function() {
            var machine_name = this.props.model.get('machine_name') ||
                this.props.model.get('machine_alias');
            return [this.props.model.get('ip_address') + ', from ',
                React.DOM.a({}, machine_name)];
        }
    });

    var VolumeProjectItem = React.createClass({
        mixins: [ProjectItemMixin],
        getClassName: function() {
            return 'volume';
        },
        renderName: function() {
            /* TODO: Move this to the model */
            var volume_url = function(volume) {
                var provider_id = volume.get('identity').provider;
                var identity_id = volume.get('identity').id;
                return 'provider/' + provider_id + '/identity/' + identity_id + '/volumes/' + volume.id;
            };
            var volume = this.props.model;
            var url = volume_url(volume);
            return React.DOM.a({
                href: url_root + '/' + url,
                onClick: function(e) {
                    e.preventDefault();
                    Backbone.history.navigate(url, {trigger: true});
                }}, volume.get('name_or_id'));
        },
        renderDetails: function() {
            return [this.props.model.get('size') + ' GB, created ',
                Time({date: this.props.model.get('start_date')})];
        }
    });

    var ProjectItems = React.createClass({
        render: function() {
            var project = this.props.project;
            var items = [];
            items = items.concat(project.get('instances').map(function(instance) {
                return InstanceProjectItem({key: instance.id, model: instance});
            }));
            items = items.concat(project.get('volumes').map(function(volume) {
                return VolumeProjectItem({key: volume.id, model: volume});
            }));

            return React.DOM.ul({className: 'project-items container-fluid'}, items);
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
