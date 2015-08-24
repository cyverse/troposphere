/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({
      displayName: "ResourceStatusTooltip",

      propTypes: {
        resourceName: React.PropTypes.string.isRequired,
        status: React.PropTypes.string.isRequired,
        count: React.PropTypes.number.isRequired
      },

      render: function(){
        // Example Output:
        //
        // There are 6 Volumes with
        // a status of Unattached
        //
        // There are 4 Instances with
        // a status of Build - Deploying

        return (
          <div>
            {"You have "}
            <b>{this.props.count}</b>
            {" " + this.props.resourceName}
            {" with "}
            <br/>
            {"a status of "}
            <b>{this.props.status}</b>
          </div>
        );
      }

    });

  });
