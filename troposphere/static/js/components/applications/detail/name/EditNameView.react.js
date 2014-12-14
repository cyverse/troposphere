/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'showdown'
  ],
  function (React, Backbone, Showdown) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var image = this.props.application;

        return (
          <div className="image-info-segment row">
            <h4 className="title col-md-2">Name</h4>
            <div className="content col-md-10">
              <input defaultValue={image.get('name')} onChange={this.props.handleChange}/>
            </div>
          </div>
        );
      }

    });

  });
