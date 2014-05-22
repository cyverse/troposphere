/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Time.react'
  ],
  function (React, Time) {

    return React.createClass({

      render: function () {
        var machine = this.props.machine;
        return (
          <li>
            {"Version: "}
            {machine.get('pretty_version')}
            <br/>
            {"Date: "}
            <Time date={machine.get('start_date')} showRelative={false}/>
          </li>
        );
      }

    });

  });
