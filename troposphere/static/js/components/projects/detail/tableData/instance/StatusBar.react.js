/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        state: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var state = this.props.state;

        var percentComplete = state.getPercentComplete();
        var style = {width: "0%"};

        style.width = percentComplete + "%";

        if(!percentComplete || percentComplete === 100){
          return (
            null
          );
        }

        return (
          <div className="progress">
            <div className="progress-bar progress-bar-success progress-bar-striped active" style={style}>
              {style.width}
            </div>
          </div>
        );
      }

    });

  });
