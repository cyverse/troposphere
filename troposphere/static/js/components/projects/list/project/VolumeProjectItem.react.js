/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Time.react',
    'url',
    './ProjectItemMixin.react',
    'backbone'
  ],
  function (React, Time, URL, ProjectItemMixin, Backbone) {

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
        var size = this.props.model.get('size');
        var createdOn = this.props.model.get('start_date');
        return (
          <div>
            {size + ' GB, created '}
            <Time date={createdOn}/>
          </div>
        );
      }

    });

  });
