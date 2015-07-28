
define(
  [
    'react',
    'backbone',
    'showdown'
  ],
  function (React, Backbone, Showdown) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        value: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
      },
      render: function () {
        return (
          <div className="image-info-segment row">
            <h4 className="title col-md-2">Description</h4>

            <div className="content col-md-10">
              <textarea value={this.props.value} onChange={this.props.onChange}/>
            </div>
          </div>
        );
      }

    });

  });
