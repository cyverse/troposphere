
define(
  [
    'react',
    'backbone',
    'components/projects/common/ResourceDetail.react',
    'components/projects/common/StatusLight.react',
    'components/projects/detail/resources/tableData/instance/Status.react.js',
    'components/projects/detail/resources/tableData/instance/StatusBar.react'
  ],
  function (React, Backbone, ResourceDetail, StatusLight, Status, StatusBar) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {

        return (
          <ResourceDetail label="Status">
            <div className="resource-status">
              <Status instance={this.props.instance}/>
            </div>
          </ResourceDetail>
        );
      }

    });

  });
