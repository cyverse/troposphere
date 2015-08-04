/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'showdown'
  ],
  function (React, Backbone, Showdown) {

    return React.createClass({
      getDefaultProps: function() {
        return {
          title: "Description"
        }
      },
      getDefaultProps: function() {
        return {
          className: "image-info-segment row"
        }
      },
      propTypes: {
        title: React.PropTypes.string,
        value: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
      },
      render: function () {
        return (
          <div className={this.props.className}>
            <h4 className="title col-md-2">{this.props.title}</h4>
            <div className="content col-md-10">
              <textarea value={this.props.value} onChange={this.props.onChange}/>
            </div>
          </div>
        );
      }

    });

  });
