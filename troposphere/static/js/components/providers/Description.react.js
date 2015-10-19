
define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({
      displayName: "Description",

      propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var provider = this.props.provider;

        return (
          <div className="row provider-info-section">
            <h4>Description</h4>

            <p>{provider.get('description')}</p>
          </div>
        );

      }

    });

  });
