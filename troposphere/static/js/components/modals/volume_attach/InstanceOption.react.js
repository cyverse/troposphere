
define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <option value={this.props.instance.id}>
            {this.props.instance.get('name')}
          </option>
        );
      }
    });

  });
