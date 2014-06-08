/** @jsx React.DOM */

define(
  [
    'react',
    'url',
    './ProjectItemMixin.react',
    'backbone'
  ],
  function (React, URL, ProjectItemMixin, Backbone) {

    return React.createClass({
      mixins: [ProjectItemMixin],

      propTypes: {
        model: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getClassName: function () {
        return 'instance';
      },

      renderName: function () {
        var instance = this.props.model;
        var href = URL.instance(instance, {absolute: true});

        return (
          <a href={href}>
            {this.props.model.get('name_or_id')}
          </a>
        );
      },

      renderDetails: function () {
        var machine_name = this.props.model.get('machine_name') || this.props.model.get('machine_alias');
        var ip = this.props.model.get('public_ip_address');
        return (
          <div>
            {ip ? ip + ', ' : ''}
            {'from '}
            <a>{machine_name}</a>
          </div>
        );
      }

    });

  });
