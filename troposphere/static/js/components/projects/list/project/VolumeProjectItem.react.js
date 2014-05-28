/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Time.react',
    'url',
    './ProjectItemMixin.react'
  ],
  function (React, Time, URL, ProjectItemMixin) {

    return React.createClass({
      mixins: [ProjectItemMixin],

      propTypes: {
        model: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        projects: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getClassName: function () {
        return 'volume';
      },

      renderName: function () {
        var volume = this.props.model;
        var href = URL.volume(volume, {absolute: true});

        return (
          <a href={href}>
            {volume.get('name_or_id')}
          </a>
        );
      },

      renderDetails: function () {
        return [
          this.props.model.get('size') + ' GB, created ',
          <Time date={this.props.model.get('start_date')}/>
        ];
      }

    });

  });
