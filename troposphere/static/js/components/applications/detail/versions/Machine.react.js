/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react'
  ],
  function (React, Backbone, Time) {

    return React.createClass({

      propTypes: {
        machine: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <li>
            {"Version: "}
            {this.props.machine.get('pretty_version')}
            <br/>
            {"Date: "}
            <Time date={this.props.machine.get('start_date')} showRelative={false}/>
          </li>
        );
      }

    });

  });
