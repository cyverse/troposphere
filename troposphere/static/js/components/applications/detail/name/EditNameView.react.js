/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'showdown'
  ],
  function (React, Backbone, Showdown) {

    return React.createClass({
      displayName: "EditNameView",

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        value: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      render: function () {
        var image = this.props.application,
            name = this.props.value;

        return (
          <div className="image-info-segment row">
            <h4 className="title col-md-2">Name</h4>
            <div className="content col-md-10">
              <input value={name} onChange={this.props.onChange}/>
            </div>
          </div>
        );
      }

    });

  });
