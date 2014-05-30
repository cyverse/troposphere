/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react'
  ],
  function (React, Glyphicon) {

    return React.createClass({

      render: function () {

        return (
          <div className="container-fluid">
          <div className="rating row-fluid">
            <div className="col-xs-6 votes votes-up">
              <Glyphicon name="thumbs-up" />
              <span>{this.props.up}</span>
            </div>
            <div className="col-xs-6 votes votes-down">
              <Glyphicon name="thumbs-down" />
              <span>{this.props.down}</span>
            </div>
          </div>
          </div>
        );
      }

    });

  });
