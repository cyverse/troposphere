
define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react',
    'components/common/Time.react'
  ],
  function (React, Backbone, ResourceDetail, Time) {

    return React.createClass({
      displayName: "LaunchDate",

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <ResourceDetail label="Launched">
            <Time date={this.props.instance.get('start_date')}/>
          </ResourceDetail>
        );
      }

    });

  });
