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
          className: "image-description"
        }
      },
      propTypes: {
        title: React.PropTypes.string,
        value: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        titleClassName:React.PropTypes.string,
        formClassName:React.PropTypes.string
      },
      render: function () {
        return (
          <div className={this.props.className}>
            <h4 className={this.props.titleClassName}>{this.props.title}</h4>
            <div className={this.props.formClassName}>
              <textarea className="form-control" rows="7" value={this.props.value} onChange={this.props.onChange}/>
            </div>
          </div>
        );
      }

    });

  });
