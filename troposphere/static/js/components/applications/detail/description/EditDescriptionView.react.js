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
        var application = this.props.application,
            description = application.get('description');

        return (
          <div className="image-info-segment row">
            <h4 className="title col-md-2">Description</h4>
            <div className="content col-md-10">
              <textarea defaultValue={description} onChange={this.props.handleChange}/>
            </div>
          </div>
        );
      }

    });

  });
